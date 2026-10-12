/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { NextRequest, NextResponse } from "next/server";
import { createAuthService } from "@/services/auth";
import { cookieOptions } from "@/utils";
import { authedRestApiCall } from "@/lib/rest/authed-rest-api";
import { decodeJwt } from "jose";
import { LoginResponse } from "@/types/response/user";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const MUST_CHANGE_PASSWORD = "mustChangePassword";
export const REFRESH_THRESHOLD_SECONDS = 10;

/**
 * Uses this function to check proactively the token expiration
 * @param accessToken
 */
function shouldRefreshToken(accessToken: string): boolean {
    try {
        const { exp } = decodeJwt(accessToken);
        if (!exp) {
            return true;
        }
        return exp <= Math.floor(Date.now() / 1000) + REFRESH_THRESHOLD_SECONDS;
    } catch {
        return true;
    }
}

/**
 * Creates new response including new tokens generated
 * @param request
 * @param refreshed
 */
function createRefreshedTokenResponse(request: NextRequest, refreshed: LoginResponse) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Cookie", request.cookies.toString());
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(ACCESS_TOKEN_KEY, refreshed.accessToken, cookieOptions(refreshed.expiresIn));
    if (refreshed.refreshToken) {
        response.cookies.set(REFRESH_TOKEN_KEY, refreshed.refreshToken, cookieOptions(refreshed.refreshExpiresIn));
    }
    return response;
}

/**
 * Updates downstream request with new tokens
 * @param request
 * @param refreshed
 */
function updateRequestCookies(request: NextRequest, refreshed: LoginResponse) {
    request.cookies.set(ACCESS_TOKEN_KEY, refreshed.accessToken);
    if (refreshed.refreshToken) {
        request.cookies.set(REFRESH_TOKEN_KEY, refreshed.refreshToken);
    }
}

/**
 * Proxy (Next.js request interception — formerly "middleware").
 *
 * Runs on the server BEFORE any route is rendered. Renamed from `middleware.ts` in Next.js 16; defaults to the Node.js runtime.
 *
 * Responsibilities
 * ----------------
 * 1. Auth gate: redirect unauthenticated requests to /login.
 * 2. Silent token refresh: when the short-lived `token` cookie has expired but a `refreshToken` cookie is still present,
 * exchange it for a fresh access token and set the new cookies on the response.
 *
 * When the access token expires, it is automatically removed from the browser's cookies,
 * making it unavailable for the refresh request, which requires a Bearer token in the Authorization header.
 * To prevent this the proxy should proactively refresh the access token a few seconds before it expires
 *
 * @param request The incoming Next.js request.
 * @returns A response that either continues the request or redirects to `/login` when no authentication credentials are available.
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const loginPath = "/login";
    const loginUrl = new URL(loginPath, request.url);
    const homeUrl = new URL("/", request.url);
    const changePasswordPath = "/change-password";
    const changePasswordUrl = new URL(changePasswordPath, request.url);

    const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;
    const mustChangePwd = request.cookies.get(MUST_CHANGE_PASSWORD)?.value === "1";
    const hasToken = Boolean(accessToken);

    // Enforce mandatory password changes.
    if (mustChangePwd && pathname !== changePasswordPath) {
        return NextResponse.redirect(changePasswordUrl);
    }

    // Restrict password changes to mandatory changes.
    // TODO - add fix allowing user to access change-password form even if mustChangePassword is not pending
    if (!mustChangePwd && pathname === changePasswordPath) {
        return NextResponse.redirect(homeUrl);
    }

    // Authenticated users should not access login.
    if (pathname === loginPath && hasToken) {
        return NextResponse.redirect(homeUrl);
    }

    // Allow access to the login page.
    if (pathname === loginPath) {
        return NextResponse.next();
    }

    const needsRefresh = !accessToken || shouldRefreshToken(accessToken);
    if (needsRefresh && accessToken && refreshToken) {
        try {
            const apiUrl = process.env.CONNECTOR_API_URL!;
            const authService = createAuthService(apiUrl, authedRestApiCall);
            const refreshed = await authService.refreshToken(refreshToken);

            if (!refreshed?.accessToken) {
                throw new Error("Token refresh failed.");
            }
            // Update request cookies for downstream calls
            updateRequestCookies(request, refreshed);

            // Persist new access token and refresh token in the response
            return createRefreshedTokenResponse(request, refreshed);
        } catch (error) {
            console.error("[Proxy] Refresh failed:", error);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete(ACCESS_TOKEN_KEY);
            response.cookies.delete(REFRESH_TOKEN_KEY);
            return response;
        }
    }

    // Neither access and refresh token is available.
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(loginUrl);
    }

    // Access token exists: continue.
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!forbidden|api/auth|_next/static|_next/image|favicon.ico).*)"]
};

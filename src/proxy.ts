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
import { restApiCall } from "@/lib/rest";
import { createAuthService } from "@/services/auth";
import { cookieOptions } from "@/utils";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const MUST_CHANGE_PASSWORD = "mustChangePassword";

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
 * @param request The incoming Next.js request.
 * @returns A response that either continues the request or redirects to `/login` when no authentication credentials are available.
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasToken = request.cookies.has(ACCESS_TOKEN_KEY);
    const refresh = request.cookies.get(REFRESH_TOKEN_KEY)?.value;
    const mustChangePwd = request.cookies.get(MUST_CHANGE_PASSWORD)?.value === "1";

    if (mustChangePwd && pathname !== "/change-password") {
        return NextResponse.redirect(new URL("/change-password", request.url));
    }

    if (!mustChangePwd && pathname === "/change-password") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/login" && hasToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/login") {
        return;
    }

    if (!hasToken && refresh) {
        const apiUrl = process.env.CONNECTOR_API_URL!;
        const authService = createAuthService(apiUrl, restApiCall);

        let refreshed;
        try {
            refreshed = await authService.refreshToken(refresh);
        } catch {
            refreshed = null;
        }

        if (refreshed) {
            request.cookies.set(ACCESS_TOKEN_KEY, refreshed.accessToken);
            const response = NextResponse.next({ request });

            response.cookies.set(ACCESS_TOKEN_KEY, refreshed.accessToken, cookieOptions(refreshed.expiresIn));

            if (refreshed.refreshToken) {
                response.cookies.set(REFRESH_TOKEN_KEY, refreshed.refreshToken, cookieOptions(refreshed.refreshExpiresIn));
            }
            return response;
        }
    }

    if (!hasToken && !refresh) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!forbidden|api/auth|_next/static|_next/image|favicon.ico).*)"]
};

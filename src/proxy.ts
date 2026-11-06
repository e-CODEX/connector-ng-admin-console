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
import { decodeJwt } from "jose";
import { LoginResponse } from "@/types/response/user";
import { cookies } from "next/headers";
import { restApiCall } from "@/lib/rest";
import { ACCESS_TOKEN_KEY, MUST_CHANGE_PASSWORD, REFRESH_TOKEN_KEY } from "@/utils/constants";
import { isBackendDown } from "@/lib/rest/backend-down";

const REFRESH_THRESHOLD_SECONDS = 10;
const LOGIN_PATH = "/login";
const CHANGE_PASSWORD_PATH = "/change-password";

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

function createRefreshedTokenResponse(request: NextRequest, refreshed: LoginResponse) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Cookie", request.cookies.toString());

    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } = refreshed;

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions(expiresIn));
    response.cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions(refreshExpiresIn));

    return response;
}

async function updateRequestCookies(request: NextRequest, refreshed: LoginResponse) {
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } = refreshed;

    const cookieStore = await cookies();

    request.cookies.set(ACCESS_TOKEN_KEY, accessToken);
    cookieStore.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions(expiresIn));

    request.cookies.set(REFRESH_TOKEN_KEY, refreshToken);
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions(refreshExpiresIn));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const loginUrl = new URL(LOGIN_PATH, request.url);
    const homeUrl = new URL("/", request.url);
    const changePasswordUrl = new URL(CHANGE_PASSWORD_PATH, request.url);

    const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;
    const mustChangePwd = request.cookies.get(MUST_CHANGE_PASSWORD)?.value === "1";

    if (mustChangePwd && pathname !== CHANGE_PASSWORD_PATH) {
        return NextResponse.redirect(changePasswordUrl);
    }

    // TODO - allow the user to reach change-password even when not pending.
    if (!mustChangePwd && pathname === CHANGE_PASSWORD_PATH) {
        return NextResponse.redirect(homeUrl);
    }

    if (pathname === LOGIN_PATH && accessToken) {
        return NextResponse.redirect(homeUrl);
    }

    if (pathname === LOGIN_PATH) {
        return NextResponse.next();
    }

    if (refreshToken && (!accessToken || shouldRefreshToken(accessToken))) {
        try {
            const apiUrl = process.env.CONNECTOR_API_URL!;
            const authService = createAuthService(apiUrl, restApiCall);
            const refreshed = await authService.refreshToken(refreshToken);

            await updateRequestCookies(request, refreshed);

            return createRefreshedTokenResponse(request, refreshed);
        } catch (error) {
            // Backend outage: keep the session, the page will render its error state.
            if (isBackendDown(error)) {
                return NextResponse.next();
            }

            // The refresh token was rejected: really log out.
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete(ACCESS_TOKEN_KEY);
            response.cookies.delete(REFRESH_TOKEN_KEY);

            const cookieStore = await cookies();
            cookieStore.delete(ACCESS_TOKEN_KEY);
            cookieStore.delete(REFRESH_TOKEN_KEY);

            return response;
        }
    }

    if (!accessToken) {
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!forbidden|api/auth|_next/static|_next/image|favicon.ico).*)"]
};

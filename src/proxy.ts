/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createAuthService } from "@/services/auth";
import { cookieOptions } from "@/utils";
import { decodeJwt } from "jose";
import type { LoginResponse } from "@/types/response/user";
import { cookies } from "next/headers";
import { restApiCall } from "@/lib/rest";
import {
    ACCESS_TOKEN_KEY,
    LOGIN_EXPIRED_PATH,
    MUST_CHANGE_PASSWORD,
    REFRESH_TOKEN_KEY,
    SESSION_EXPIRED_MARKER,
    SESSION_EXPIRED_MARKER_MAX_AGE_SECONDS,
} from "@/utils/constants";
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

/**
 * The session is gone or cannot be renewed. Page navigations go to the login page.
 */
async function sessionExpiredResponse(request: NextRequest, { known }: { known: boolean }) {
    // The token cookies are deleted as soon as an expiry is detected, so a following request (e.g. a link
    // prefetched on hover, then the click) would look like a first visit: the short-lived marker remembers it.
    const expired = known || request.cookies.get(SESSION_EXPIRED_MARKER)?.value === "1";
    const loginPath = expired ? LOGIN_EXPIRED_PATH : LOGIN_PATH;
    const response = request.nextUrl.pathname.startsWith("/api/")
        ? NextResponse.json({ message: "Your session has expired." }, { status: 401 })
        : NextResponse.redirect(new URL(loginPath, request.url));

    // Written to both: once the `cookies()` store has been touched (e.g. by the failed refresh call), its cookies
    // replace the ones set on `response`, which would drop the marker.
    const cookieStore = await cookies();
    for (const store of [response.cookies, cookieStore]) {
        store.delete(ACCESS_TOKEN_KEY);
        store.delete(REFRESH_TOKEN_KEY);
        if (known) {
            store.set(SESSION_EXPIRED_MARKER, "1", cookieOptions(SESSION_EXPIRED_MARKER_MAX_AGE_SECONDS));
        }
    }

    return response;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

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
            return sessionExpiredResponse(request, { known: true });
        }
    }

    if (!accessToken) {
        return sessionExpiredResponse(request, { known: false });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!forbidden|api/auth|api/backend/actuator/(?:health|info)$|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
    ],
};

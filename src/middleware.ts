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

export async function middleware(request: NextRequest) {
    const hasToken = request.cookies.has("token");
    const refresh = request.cookies.get("refreshToken")?.value;

    if (!hasToken && refresh) {
        const apiUrl = process.env.CONNECTOR_API_URL!;
        const authService = createAuthService(apiUrl, restApiCall);

        let refreshedToken;

        try {
            refreshedToken = await authService.refreshToken(refresh);
        } catch {
            refreshedToken = null;
        }

        if (refreshedToken !== null) {
            const nextResponse = NextResponse.next();
            nextResponse.cookies.set("token", refreshedToken.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: refreshedToken.expiresIn,
            });

            if (refreshedToken.refreshToken) {
                nextResponse.cookies.set("refreshToken", refreshedToken.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                });
            }
            return nextResponse;
        }
    }

    if (!hasToken && !refresh) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!login|forbidden|api/auth|_next/static|_next/image|favicon.ico).*)"]
};

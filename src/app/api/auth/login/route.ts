/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAppConfig } from "@/config/config.server";
import { RestApiError } from "@/lib/rest/rest-api-error";
import { restApiCall } from "@/lib/rest";
import { createAuthService } from "@/services/auth";
import { cookieOptions } from "@/utils";
import { ACCESS_TOKEN_KEY, MUST_CHANGE_PASSWORD, REFRESH_TOKEN_KEY } from "@/utils/constants";

export async function POST(request: Request) {
    const { username, password } = await request.json();
    const { apiUrl } = getAppConfig();
    const authService = createAuthService(apiUrl, restApiCall);

    try {
        const { accessToken, expiresIn, refreshToken, refreshExpiresIn, mustChangePassword } = await authService.login(username, password);

        const cookieStore = await cookies();

        cookieStore.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions(expiresIn));
        cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions(refreshExpiresIn));

        if (mustChangePassword) {
            cookieStore.set(MUST_CHANGE_PASSWORD, "1", cookieOptions());
        } else {
            cookieStore.delete(MUST_CHANGE_PASSWORD)
        }

        return NextResponse.json({ user: "OK", mustChangePassword }, { status: 201 });
    } catch (e) {
        if (e instanceof RestApiError && e.status === 401) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (e instanceof RestApiError) {
            console.error(e.message);
        }

        return NextResponse.json({ error: "Login failed" }, { status: 502 });
    }
}

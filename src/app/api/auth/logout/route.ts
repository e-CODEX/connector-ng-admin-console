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
import { authedRestApiCall } from "@/lib/rest/authed-rest-api";
import { createAuthService } from "@/services/auth";

export async function POST() {
    const { apiUrl } = getAppConfig();
    const authService = createAuthService(apiUrl, authedRestApiCall);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("token")?.value;

    if (accessToken) {
        try {
            await authService.logout();
        } catch {
            // ignore — we clear the cookie regardless
        }
    }

    cookieStore.delete("token");
    cookieStore.delete("refreshToken");
    return NextResponse.json({ ok: true });
}

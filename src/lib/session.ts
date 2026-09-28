/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import "server-only";
import { cache } from "react";
import { ConnectorUser } from "@/types/response/user";
import { redirect } from "next/navigation";
import { getAppConfig } from "@/config/config.server";
import { USER_ROLE } from "@/types/global";
import { authedRestApiCall } from "@/lib/rest/authed-rest-api";
import { createAuthService } from "@/services/auth";

export const getCurrentUser = cache(async (): Promise<ConnectorUser | null> => {
    try {
        const { apiUrl } = getAppConfig();
        return await createAuthService(apiUrl, authedRestApiCall).me();
    } catch {
        return null; // no/expired/invalid token -> logged out
    }
});

export async function requireUser(): Promise<ConnectorUser> {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }

    return user;
}

export async function requireRole(...roles: USER_ROLE[]): Promise<ConnectorUser> {
    const user = await requireUser();
    if (!roles.some((r) => user?.roles.includes(r))) {
        redirect("/forbidden");
    }

    return user;
}

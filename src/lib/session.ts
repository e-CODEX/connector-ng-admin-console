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
import type { ConnectorUser } from "@/types/response/user";
import { redirect } from "next/navigation";
import { getAppConfig } from "@/config/config.server";
import type { USER_ROLE } from "@/types/global";
import { authedRestApiCall } from "@/lib/rest/authed-rest-api";
import { createAuthService } from "@/services/auth";
import { BackendUnavailableError, isBackendDown } from "@/lib/rest/backend-down";
import type { BACKEND_DOWN} from "@/utils/constants";
import { ACCESS_TOKEN_KEY, BACKEND_DOWN_TAG } from "@/utils/constants";
import { cookies } from "next/headers";

export const getCurrentUser = cache(async (): Promise<ConnectorUser | null> => {
    // No session cookie: nothing to verify, so the backend isn't needed (login page works offline).
    const token = (await cookies()).get(ACCESS_TOKEN_KEY)?.value;

    if (!token) {
        return null;
    }

    try {
        const { apiUrl } = getAppConfig();
        return await createAuthService(apiUrl, authedRestApiCall).me();
    } catch (error) {
        if (isBackendDown(error)) {
            throw new BackendUnavailableError(error);
        }

        return null;
    }
});

export async function requireUser(): Promise<ConnectorUser> {
    const user = await getCurrentUser();
    if (!user) {
        // The proxy only lets requests through when a token cookie exists, so a null user here
        // means the backend rejected that token. /login would bounce back to "/" (cookie still
        // present), so go through a route that clears the cookies first.
        redirect("/api/auth/session-expired");
    }

    return user;
}

export async function requireUserOrDown(): Promise<ConnectorUser | BACKEND_DOWN> {
    try {
        return await requireUser();
    } catch (error) {
        if (error instanceof BackendUnavailableError) {
            return BACKEND_DOWN_TAG;
        }

        throw error;
    }
}

export async function requireRoleOrDown(...roles: USER_ROLE[]): Promise<ConnectorUser | BACKEND_DOWN> {
    const user = await requireUserOrDown();

    if (user === BACKEND_DOWN_TAG) {
        return BACKEND_DOWN_TAG;
    }

    if (!roles.some((r) => user.roles.includes(r))) {
        redirect("/forbidden");
    }

    return user;
}

/** Never throws on an outage: returns "down" so the caller can render the retry screen. */
export async function getCurrentUserOrDown(): Promise<ConnectorUser | null | "down"> {
    try {
        return await getCurrentUser();
    } catch (error) {
        if (error instanceof BackendUnavailableError) {
            return BACKEND_DOWN_TAG;
        }

        throw error;
    }
}

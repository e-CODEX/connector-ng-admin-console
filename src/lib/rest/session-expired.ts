/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { LAST_KNOWN_USER_KEY, SESSION_EXPIRED_PATH } from "@/utils/constants";

let redirecting = false;

/**
 * True for a 401 seen in the browser on one of the app's own API routes (the backend proxy): the access token
 * is gone, was rejected, or could not be renewed.
 */
export function isSessionExpiredResponse(status: number, baseUrl: string): boolean {
    return status === 401 && typeof window !== "undefined" && baseUrl.startsWith("/");
}

/**
 * Signs the user out and sends them to the login page.
 */
export function handleSessionExpired(): Promise<never> {
    if (!redirecting) {
        redirecting = true;
        try {
            localStorage.removeItem(LAST_KNOWN_USER_KEY);
        } catch {
            // Storage unavailable: nothing cached to forget.
        }
        window.location.assign(SESSION_EXPIRED_PATH);
    }

    return new Promise<never>(() => {});
}

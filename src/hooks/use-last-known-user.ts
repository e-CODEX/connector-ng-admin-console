/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { ConnectorUser } from "@/types/response/user";

export type NavUser = Pick<ConnectorUser, "username" | "email" | "roles">;

const KEY = "connector-ui:last-known-user";

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);

    return () => window.removeEventListener("storage", callback);
}

function readRaw(): string | null {
    try {
        return localStorage.getItem(KEY);
    } catch {
        return null;
    }
}

export function rememberUser(user: ConnectorUser) {
    try {
        const nav: NavUser = { username: user.username, email: user.email, roles: user.roles };
        localStorage.setItem(KEY, JSON.stringify(nav));
    } catch {
        // storage unavailable: the header just won't be shown during an outage
    }
}

export function forgetUser() {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // do nothing
    }
}

export function useLastKnownUser(): NavUser | null {
    // Server snapshot is null, so hydration never mismatches.
    const raw = useSyncExternalStore(subscribe, readRaw, () => null);

    return useMemo(() => {
        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw) as NavUser;
        } catch {
            return null;
        }
    }, [raw]);
}

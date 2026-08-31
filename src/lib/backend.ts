/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

// lib/backend.ts
import "server-only";
import { cookies } from "next/headers";

export async function backendFetch(path: string, init: RequestInit = {}) {
    const token = (await cookies()).get("token")?.value;
    return fetch(`${process.env.BACKEND_URL}${path}`, {
        ...init,
        headers: {
            ...init.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
    });
}

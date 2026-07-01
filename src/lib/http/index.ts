/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { API_BASE_URL } from "@/lib/config";

export async function restApiCall<T>(url: string, options: RequestInit & {
    params?: Record<string, string | number | boolean>
} = {}): Promise<T> {
    const { params, ...init } = options;
    const qs = params ? `?${toQuery(params)}` : "";
    const response = await fetch(`${API_BASE_URL}/${url}${qs}`, init);

    if (!response.ok) {
        throw new Error(`HTTP error! ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

function toQuery(params: Record<string, string | number | boolean | undefined | null>) {
    const sp = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            sp.append(key, String(value));
        }
    }

    return sp.toString();
}
/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import {API_BASE_URL} from "@/lib/config";

interface ApiError {
    status: number;
    message: string;
}

export class RestApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "RestApiError";
        this.status = status;
    }
}

/**
 * Performs an HTTP request to API and returns the response typed as `T`.
 * Important: Backends have enabled CORS settings. No need to implement the Next.js rewrite mechanism.
 *
 * @template T Expected response payload type.
 * @param path Relative endpoint URL from Connector Backend API
 * @param options Fetch API request options.
 * @param options.params Optional query string parameters to append to the URL.
 * @param baseUrl Optional base URL used when calling the API from a different domain from the Connector Backend API.
 *
 * @returns A promise that resolves with the parsed response body.
 *
 * @throws {Error} Throws an error if the request fails, the response status is not successful,
 * or the response payload cannot be processed.
 *
 * @example
 * ```ts
 * const user = await restApiCall<User>(
 *   '/users/1',
 *   {
 *     method: 'GET',
 *     params: { includeDetails: true }
 *   },
 *   'https://api.example.com'
 * );
 * ```
 */
export async function restApiCall<T>(path: string, options: RequestInit & {
    params?: Record<string, string | number | boolean>
} = {}, baseUrl: string = API_BASE_URL): Promise<T> {

    const {params, ...init} = options;
    const qs = params ? `?${toQuery(params)}` : "";
    const response = await fetch(`${baseUrl}/${path}${qs}`, init);

    if (!response.ok) {
        let message = `HTTP error! ${response.status} ${response.statusText}`;
        try {
            const body = await response.json() as Partial<ApiError>;
            if (body && typeof body.message === "string") {
                message = body.message;
            }
        } catch {
            // Body was empty or not JSON — keep the default message
        }
        throw new RestApiError(response.status, message);
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

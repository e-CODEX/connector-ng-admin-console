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
import { RestApiError } from "@/lib/rest/rest-api-error";

interface ApiError {
    status: number;
    message: string;
}

type RestApiOptions = RequestInit & {
    params?: Record<string, string | number | boolean>;
};

function toQuery(params: Record<string, string | number | boolean | undefined | null>) {
    const sp = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            sp.append(key, String(value));
        }
    }

    return sp.toString();
}

/** Performs the call and throws RestApiError on a non-2xx response. */
async function restApiFetch(
    path: string,
    options: RestApiOptions,
    baseUrl: string,
): Promise<Response> {
    const { params, ...init } = options;
    const qs = params ? `?${toQuery(params)}` : "";
    const response = await fetch(`${baseUrl}/${path}${qs}`, init);
    if (!response.ok) {
        throw new RestApiError(response.status, await extractErrorMessage(response));
    }
    return response;
}

async function extractErrorMessage(response: Response): Promise<string> {
    try {
        const body = await response.json() as Partial<ApiError>;
        if (body && typeof body.message === "string") {
            return body.message;
        }
    } catch {
        // Body was empty or not JSON — fall through to the default message
    }
    return `HTTP error! ${response.status} ${response.statusText}`;
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
 * const user = await restApiCall<User>('/users/1',
 *   {
 *     method: 'GET',
 *     params: { includeDetails: true }
 *   },
 *   'https://api.example.com'
 * );
 * ```
 */
export async function restApiCall<T>(
    path: string,
    options: RestApiOptions = {},
    baseUrl: string = API_BASE_URL,
): Promise<T> {
    const response = await restApiFetch(path, options, baseUrl);

    if (response.status === 204) {
        return undefined as T;   // no content
    }

    return response.json() as Promise<T>;
}

export interface DownloadedFile {
    blob: Blob;
    filename: string;
    contentType: string;
}

export async function restApiDownload(
    path: string,
    options: RestApiOptions & { defaultFilename?: string } = {},
    baseUrl: string = API_BASE_URL,
): Promise<DownloadedFile> {
    const { defaultFilename = "download", ...rest } = options;
    const response = await restApiFetch(path, {
        ...rest,
        headers: { Accept: "application/octet-stream, */*", ...rest.headers },
    }, baseUrl);

    const blob = await response.blob();
    return {
        blob,
        filename: parseFilename(response.headers.get("Content-Disposition")) ?? defaultFilename,
        contentType: response.headers.get("Content-Type") ?? blob.type ?? "application/octet-stream",
    };
}

/** Handles both `filename="x.xlsx"` and RFC 5987 `filename*=UTF-8''x%20y.xlsx`. */
function parseFilename(header: string | null): string | undefined {
    if (!header) return undefined;

    const encoded = /filename\*=\s*([^']*)'[^']*'([^;]+)/i.exec(header);
    if (encoded) {
        try {
            return decodeURIComponent(encoded[2].trim());
        } catch {
            // Malformed percent-encoding — fall back to the plain parameter
        }
    }

    const plain = /filename=\s*"?([^";]+)"?/i.exec(header);
    return plain?.[1].trim();
}

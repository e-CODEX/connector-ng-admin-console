/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export class BackendUnavailableError extends Error {
    constructor(cause?: unknown) {
        super("Backend unavailable", { cause });
        this.name = "BackendUnavailableError";
    }
}

const NETWORK_ERROR_CODES = new Set([
    "ECONNREFUSED",
    "ECONNRESET",
    "ENOTFOUND",
    "EAI_AGAIN",
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
]);

function statusOf(error: unknown): number | undefined {
    if (typeof error !== "object" || error === null) {
        return undefined;
    }

    const e = error as { status?: unknown; statusCode?: unknown; response?: { status?: unknown } };
    const status = e.status ?? e.statusCode ?? e.response?.status;
    return typeof status === "number" ? status : undefined;
}

/** True only for a clear outage: 5xx or a failed connection. Everything else means "not authenticated". */
export function isBackendDown(error: unknown): boolean {
    if (error instanceof Error && error.name === "TimeoutError") {
        return true;
    }

    const status = statusOf(error);

    if (status !== undefined) {
        return status >= 500;
    }

    const cause = (error as { cause?: { code?: unknown } } | null)?.cause;
    const code = typeof cause?.code === "string" ? cause.code : undefined;
    return (error instanceof TypeError && error.message === "fetch failed")
        || (code !== undefined && NETWORK_ERROR_CODES.has(code));
}

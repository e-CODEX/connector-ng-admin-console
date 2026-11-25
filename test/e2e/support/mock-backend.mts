/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

/**
 * Minimal stand-in for the connector backend, used by the e2e suite.
 *
 * It only answers the calls the Next.js server makes on its own (login, refresh, /me, logout)
 * plus the actuator endpoints polled by the footer. Feature data (attachments, messages, ...)
 * is requested by the browser and stays stubbed per test with `page.route`.
 *
 * Run with: node test/e2e/support/mock-backend.mts  (Node >= 22.18, native type stripping)
 */

import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";

// Provided by playwright.config.ts (webServer env), the single source of these values.
const MOCK_BACKEND_PORT = Number(process.env.E2E_MOCK_BACKEND_PORT ?? 30999);
const MOCK_USERNAME = process.env.E2E_USER ?? "e2e-admin";
const MOCK_PASSWORD = process.env.E2E_PASSWORD ?? "E2e-Passw0rd!";

const ACCESS_TOKEN_TTL_SECONDS = 3600;
const REFRESH_TOKEN_TTL_SECONDS = 86400;

const MOCK_USER = {
    uuid: "00000000-0000-4000-8000-000000000001",
    username: MOCK_USERNAME,
    email: "e2e-admin@example.test",
    enabled: true,
    mustChangePassword: false,
    roles: ["ROLE_ADMIN", "ROLE_USER"],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
};

const base64Url = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");

/** Unsigned JWT: the app only decodes it (to read `exp`), it never verifies the signature. */
function fakeJwt(type: "access" | "refresh", ttlSeconds: number): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        sub: MOCK_USER.username,
        type,
        iat: now,
        exp: now + ttlSeconds,
    };
    return `${base64Url({ alg: "none", typ: "JWT" })}.${base64Url(payload)}.mock`;
}

function loginResponse() {
    return {
        accessToken: fakeJwt("access", ACCESS_TOKEN_TTL_SECONDS),
        expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        refreshToken: fakeJwt("refresh", REFRESH_TOKEN_TTL_SECONDS),
        refreshExpiresIn: REFRESH_TOKEN_TTL_SECONDS,
        mustChangePassword: MOCK_USER.mustChangePassword,
    };
}

const HEALTH = { status: "UP", groups: [], components: {} };
const INFO = {
    build: {
        artifact: "connector-ng",
        name: "e-CODEX Connector (mock)",
        group: "eu.ecodex",
        version: "7.1.0",
        time: "2026-01-01T00:00:00Z",
    },
};

function send(res: ServerResponse, status: number, body?: unknown) {
    if (body === undefined) {
        res.writeHead(status).end();
        return;
    }
    res.writeHead(status, { "Content-Type": "application/json" }).end(
        JSON.stringify(body),
    );
}

async function readJson(
    req: IncomingMessage,
): Promise<Record<string, unknown>> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    try {
        return JSON.parse(Buffer.concat(chunks).toString() || "{}");
    } catch {
        return {};
    }
}

const hasBearer = (req: IncomingMessage) =>
    /^Bearer \S+/.test(req.headers.authorization ?? "");

async function handle(req: IncomingMessage, res: ServerResponse) {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    const route = `${req.method} ${pathname}`;

    switch (route) {
        case "POST /api/v1/auth/login": {
            const { username, password } = await readJson(req);
            return username === MOCK_USERNAME && password === MOCK_PASSWORD
                ? send(res, 200, loginResponse())
                : send(res, 401, {
                      status: 401,
                      message: "Invalid credentials",
                  });
        }
        case "POST /api/v1/auth/refresh": {
            const { refreshToken } = await readJson(req);
            // "revoked" lets tests simulate a refresh token the backend no longer accepts.
            return typeof refreshToken === "string" && refreshToken.length > 0 && refreshToken !== "revoked"
                ? send(res, 200, loginResponse())
                : send(res, 401, {
                      status: 401,
                      message: "Invalid refresh token",
                  });
        }
        case "GET /api/v1/auth/me":
            return hasBearer(req)
                ? send(res, 200, MOCK_USER)
                : send(res, 401, { status: 401, message: "Unauthorized" });
        case "GET /api/v1/auth/logout":
        case "POST /api/v1/auth/logout":
            return send(res, 204);
        case "GET /actuator/health":
            return send(res, 200, HEALTH);
        case "GET /actuator/info":
            return send(res, 200, INFO);
        default:
            console.warn(`[mock-backend] unhandled ${route}`);
            return send(res, 404, {
                status: 404,
                message: `Mock backend: no handler for ${route}`,
            });
    }
}

createServer((req, res) => {
    handle(req, res).catch((error) => {
        console.error("[mock-backend]", error);
        send(res, 500, { status: 500, message: "Mock backend error" });
    });
}).listen(MOCK_BACKEND_PORT, () => {
    console.log(
        `[mock-backend] listening on http://localhost:${MOCK_BACKEND_PORT}`,
    );
});

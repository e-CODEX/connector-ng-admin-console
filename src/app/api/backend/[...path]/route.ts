/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAppConfig } from "@/config/config.server";
import { bearerHeader } from "@/lib/rest/bearer-header";
import { isBackendDown } from "@/lib/rest/backend-down";

async function proxy(req: NextRequest, path: string[]) {
    const { apiUrl, basicAuthUser, basicAuthPassword } = getAppConfig();

    const authorization =
        path[0] === "actuator" ? basicHeader(basicAuthUser!, basicAuthPassword!) : await bearerHeader();
    const target = `${apiUrl}/${path.join("/")}${req.nextUrl.search}`;

    let res: Response;
    try {
        res = await fetch(target, {
            method: req.method,
            headers: {
                ...authorization,
                ...(req.headers.get("content-type") ? { "Content-Type": req.headers.get("content-type")! } : {}),
            },
            body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
            // @ts-expect-error — duplex required when streaming a request body
            duplex: "half",
            cache: "no-store",
        });
    } catch (error) {
        if (!isBackendDown(error)) throw error;

        const timedOut = error instanceof Error && error.name === "TimeoutError";
        return NextResponse.json(
            {
                message: timedOut
                    ? "The connector backend did not respond in time."
                    : "The connector backend is unreachable.",
            },
            { status: timedOut ? 504 : 503 },
        );
    }

    return new NextResponse(res.body, {
        status: res.status,
        headers: {
            "Content-Type": res.headers.get("Content-Type") ?? "application/json",
            ...(res.headers.get("Content-Disposition")
                ? { "Content-Disposition": res.headers.get("Content-Disposition")! }
                : {}),
        },
    });
}

function basicHeader(user: string, password: string): { Authorization: string } {
    const token = Buffer.from(`${user}:${password}`, "utf-8").toString("base64");
    return { Authorization: `Basic ${token}` };
}

const handler = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
    ctx.params.then(({ path }) => proxy(req, path));

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

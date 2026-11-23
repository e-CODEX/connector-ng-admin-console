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

import type { AppConfig } from "@/config/config";
import { isAppMode } from "@/config/config";
import type { AppMode } from "@/types/global";
import { APP_MODES } from "@/types/global";

export function getAppConfig(): AppConfig {
    return {
        appMode: parseAppMode(process.env.APP_MODE),
        apiUrl: process.env.CONNECTOR_API_URL ?? "http://localhost:30000",
        bffUrl: process.env.CONNECTOR_BFF_URL ?? "http://localhost:4000",
        defaultOriginalSender: process.env.DEFAULT_ORIGINAL_SENDER ?? "alice",
        defaultFinalRecipient: process.env.DEFAULT_FINAL_RECIPIENT ?? "bob",
        basicAuthUser: requireEnv("BASIC_AUTH_USER"),
        basicAuthPassword: requireEnv("BASIC_AUTH_PASSWORD"),
    };
}

function parseAppMode(mode: string | undefined): AppMode {
    if (mode === undefined || mode === "") {
        return "ADMIN_CONSOLE";
    }

    if (isAppMode(mode)) {
        return mode;
    }

    throw new Error(`Invalid APP MPODE: ["${mode}"]. Expected one of: ${APP_MODES.join(", ")}`);
}

function requireEnv(name: string): string {
    const value = process.env[name];

    if (value === undefined || value.trim() === "") {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

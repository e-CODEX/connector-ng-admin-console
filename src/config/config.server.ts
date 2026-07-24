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

import { AppConfig } from "@/config/config";

export function getAppConfig(): AppConfig {
    return {
        apiUrl: process.env.CONNECTOR_API_URL ?? "http://localhost:30000",
        bffUrl: process.env.CONNECTOR_BFF_URL ?? "http://localhost:4000",
        defaultOriginalSender: process.env.DEFAULT_ORIGINAL_SENDER ?? "alice",
        defaultFinalRecipient: process.env.DEFAULT_FINAL_RECIPIENT ?? "bob",
    }
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { AppMode } from "@/types/global";
import { APP_MODES } from "@/types/global";

export type AppConfig = {
    appMode: AppMode;
    apiUrl: string;
    bffUrl: string;
    defaultOriginalSender: string;
    defaultFinalRecipient: string;
    basicAuthUser?: string;
    basicAuthPassword?: string;
};

export function isAppMode(value: unknown): value is AppMode {
    return typeof value === "string" && (APP_MODES as readonly string[]).includes(value);
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { HealthStatus } from "@/types/global";

export interface ActuatorHealthResponse {
    status: HealthStatus;
    groups: string[];
    components: Record<string, HealthComponent>;
}

export interface HealthComponent {
    status: HealthStatus;
    details?: Record<string, unknown>;
    components?: Record<string, HealthComponent>;
}

export interface AppBuildInfo {
    readonly artifact: string;
    readonly name: string;
    readonly group: string;
    readonly version: string;
    readonly time: string;
}

export interface AppInfo {
    readonly build?: AppBuildInfo;
}

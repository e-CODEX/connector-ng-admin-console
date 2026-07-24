/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { restApiCall } from "@/lib/rest";
import { ActuatorHealthResponse, AppInfo } from "@/types/response/actuator";

export function createActuatorService(baseUrl: string) {
    return {
        async getHealthInfo():
            Promise<ActuatorHealthResponse> {
            return restApiCall<ActuatorHealthResponse>(baseUrl, "actuator/health");
        },
        async getAppInfo():
            Promise<AppInfo> {
            return restApiCall<AppInfo>(baseUrl, "actuator/info");
        }
    }
}

export type ActuatorService = ReturnType<typeof createActuatorService>;

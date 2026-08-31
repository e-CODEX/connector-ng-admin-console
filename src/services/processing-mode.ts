/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import {
    ConnectorProcessingMode,
    ConnectorProcessingModeAction,
    ConnectorProcessingModeDetail,
    ConnectorProcessingModeParty,
    ConnectorProcessingModeService
} from "@/types/response/processing-mode";
import { RestApiCall } from "@/lib/rest";
import { ProcessingModeCreationRequest } from "@/types/request/processing-mode";

export function createProcessingModeService(baseUrl: string, call: RestApiCall) {
    return {
        async listProcessingModes(): Promise<ConnectorProcessingMode[]> {
            return call<ConnectorProcessingMode[]>(baseUrl, "api/v1/admin/processing-modes");
        },
        async retrieveProcessingMode(identifier: string): Promise<ConnectorProcessingModeDetail> {
            return call<ConnectorProcessingModeDetail>(baseUrl, `api/v1/admin/processing-modes/${identifier}`);
        },
        async listProcessingModeServices(businessDomain: string): Promise<ConnectorProcessingModeService[]> {
            return call<ConnectorProcessingModeService[]>(baseUrl, `api/v1/processing-modes/${businessDomain}/services`);
        },
        async listProcessingModeActions(businessDomain: string): Promise<ConnectorProcessingModeAction[]> {
            return call<ConnectorProcessingModeAction[]>(baseUrl, `api/v1/processing-modes/${businessDomain}/actions`);
        },
        async listProcessingModeParties(businessDomain: string): Promise<ConnectorProcessingModeParty[]> {
            return call<ConnectorProcessingModeParty[]>(baseUrl, `api/v1/processing-modes/${businessDomain}/parties`);
        },
        async createProcessingMode(payload: ProcessingModeCreationRequest): Promise<ConnectorProcessingMode> {
            const formData = new FormData();
            const { description, businessDomainIdentifier, processingModeFile, truststore } = payload;
            formData.append("businessDomainIdentifier", businessDomainIdentifier);
            formData.append("processingModeFile", processingModeFile);
            formData.append("description", description);
            formData.append("truststore.password", truststore.password);
            formData.append("truststore.truststoreFile", truststore.truststoreFile);

            return call<ConnectorProcessingMode>(baseUrl, "api/v1/admin/processing-modes", {
                    method: "POST",
                    body: formData
                }
            )
        }
    }
}

export type ProcessingModeService = ReturnType<typeof createProcessingModeService>;

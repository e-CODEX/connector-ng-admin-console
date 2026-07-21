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
    ConnectorProcessingModeDetailResponse,
    ConnectorProcessingModeResponse,
    ConnectorProcessingModeService
} from "@/types/response/processing-mode";
import { restApiCall } from "@/lib/rest";
import { ProcessingModeCreationRequest } from "@/types/request/processing-mode";

export async function listProcessingModes():
    Promise<ConnectorProcessingModeResponse[]> {
    return restApiCall<ConnectorProcessingModeResponse[]>("api/v1/admin/processing-modes");
}

export async function createProcessingMode(payload: ProcessingModeCreationRequest): Promise<ConnectorProcessingModeResponse> {
    const formData = new FormData();
    const { description, businessDomainIdentifier, processingModeXmlFile } = payload;
    formData.append("processingModeXmlFile", processingModeXmlFile);
    formData.append(
        "metadata",
        new Blob(
            [JSON.stringify({ description, businessDomainIdentifier })],
            { type: "application/json" }
        )
    );

    return restApiCall<ConnectorProcessingModeResponse>("api/v1/admin/processing-modes", {
            method: "POST",
            body: formData
        }
    )
}

export async function getProcessingMode(identifier: string): Promise<ConnectorProcessingModeDetailResponse> {
    return restApiCall<ConnectorProcessingModeDetailResponse>(`api/v1/admin/processing-modes/${identifier}`);
}

export async function listProcessingModeServices(businessDomain: string): Promise<ConnectorProcessingModeService[]> {
    return restApiCall<ConnectorProcessingModeService[]>(`api/v1/processing-modes/${businessDomain}/services`);
}

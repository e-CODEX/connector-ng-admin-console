/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { PaginatedResponse } from "@/types/response/paginated-response";
import { ConnectorTransportStep } from "@/types/response/transport-step";
import { RestApiCall } from "@/lib/rest";
import { ConnectorMessageDetailsResponse } from "@/types/response/message";

export type ListTransportStepsParams = {
    page?: number;
    size?: number;
    stepOrMessageOrRemoteSystemIdentifier?: string;
    linkPartnerName?: string;
    statuses?: string[];
    from?: string;
    to?: string;
}

export function createTransportStepsService(baseUrl: string, call: RestApiCall) {
    return {
        async listTransportSteps(params: ListTransportStepsParams): Promise<PaginatedResponse<ConnectorTransportStep>> {
            return call<PaginatedResponse<ConnectorTransportStep>>(
                baseUrl,
                "api/v1/admin/transport-steps",
                { params }
            )
        },
        async retrieveTransportedMessage(transportIdentifier: string): Promise<ConnectorMessageDetailsResponse> {
            return call<ConnectorMessageDetailsResponse>(baseUrl, `api/v1/admin/transport-steps/${transportIdentifier}/message`);
        },
    }
}

export type TransportStepsService = ReturnType<typeof createTransportStepsService>;

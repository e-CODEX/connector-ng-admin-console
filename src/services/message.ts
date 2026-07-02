/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { PaginatedResponse } from "@/types/paginated-response";
import { ConnectorMessage, ConnectorMessageDetails } from "@/types/message";
import { restApiCall } from "@/lib/http";
import { ConnectorTransportStep } from "@/types/transport-step";

export async function listMessages(params?: {
    page?: number,
    size?: number,
    identifier?: string,
    backendName?: string
}):
    Promise<PaginatedResponse<ConnectorMessage>> {
    return restApiCall<PaginatedResponse<ConnectorMessage>>(
        "api/v1/admin/messages",
        { params }
    );
}

export async function getMessage(identifier: string): Promise<ConnectorMessageDetails> {
    return restApiCall<ConnectorMessageDetails>(
        `api/v1/admin/messages/${identifier}`
    );
}

export async function getMessageTransportStep(identifier: string): Promise<ConnectorTransportStep> {
    return restApiCall<ConnectorTransportStep>(
        `api/v1/admin/messages/${identifier}/transport-steps`
    );
}

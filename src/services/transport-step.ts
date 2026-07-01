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
import { restApiCall } from "@/lib/http";

export async function listTransportSteps(params?: {
    page?: number,
    size?: number,
    messageOrRemoteSystemIdentifier?: string,
    linkPartnerName?: string
}):
    Promise<PaginatedResponse<ConnectorTransportStep>> {
    return restApiCall<PaginatedResponse<ConnectorTransportStep>>(
        "api/v1/admin/transport-steps",
        { params }
    );
}
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
import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { restApiCall } from "@/lib/rest";

export async function listAttachments(params?: {
    page?: number,
    size?: number
}):
    Promise<PaginatedResponse<ConnectorAttachmentResponse>> {
    return restApiCall<PaginatedResponse<ConnectorAttachmentResponse>>("api/v1/admin/attachments", {
        params
    });
}

export function uploadMessageAttachment(file: Blob) {
    const data = new FormData();
    data.append("attachments", file, "business-document.pdf");
    data.append("attachments", file, "business-document2.pdf");

    return restApiCall<string[]>("api/v1/attachments/upload", {
            method: "POST",
            body: data,
        }
    );
}

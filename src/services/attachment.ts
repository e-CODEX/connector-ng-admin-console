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
import { DownloadedFile, restApiCall, restApiDownload } from "@/lib/rest";

export type ListAttachmentsParams = {
    page?: number;
    size?: number;
}

export function createAttachmentService(baseUrl: string) {
    return {
        async listAttachments(params?: ListAttachmentsParams):
            Promise<PaginatedResponse<ConnectorAttachmentResponse>> {
            return restApiCall<PaginatedResponse<ConnectorAttachmentResponse>>(
                baseUrl,
                "api/v1/admin/attachments",
                { params }
            );
        },
        async uploadMessageAttachment(file: Blob) {
            const data = new FormData();
            data.append("attachments", file, "business-document.pdf");
            data.append("attachments", file, "business-document2.pdf");

            return restApiCall<string[]>(
                baseUrl,
                "api/v1/attachments/upload",
                { method: "POST", body: data, }
            );
        },
        async downloadAttachment(identifier: string, name: string): Promise<DownloadedFile> {
            return restApiDownload(
                baseUrl,
                `api/v1/admin/attachments/${identifier}/download`,
                { defaultFilename: name }
            );
        }
    }
}

export type AttachmentService = ReturnType<typeof createAttachmentService>;

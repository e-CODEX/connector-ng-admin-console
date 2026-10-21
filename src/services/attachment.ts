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
import { DownloadedFile, RestApiCall, RestApiDownloadCall } from "@/lib/rest";

export type ListAttachmentsParams = {
    page?: number;
    size?: number;
    messageIdentifier?: string;
    name?: string;
    types?: string[];
    storages?: string[];
    from?: string;
    to?: string;
}

export function createAttachmentService(baseUrl: string, call: RestApiCall, download: RestApiDownloadCall) {
    return {
        async listAttachments(params?: ListAttachmentsParams): Promise<PaginatedResponse<ConnectorAttachmentResponse>> {
            return call<PaginatedResponse<ConnectorAttachmentResponse>>(
                baseUrl,
                "api/v1/admin/attachments",
                { params }
            );
        },
        async uploadMessageAttachment(file: Blob, repeat: number) {
            const data = new FormData();
            for (let i = 0; i < repeat; i++) {
                data.append("attachments", file, "message-attachment-"+ i +".pdf" );
            }
            return call<string[]>(
                baseUrl,
                "api/v1/attachments/upload",
                { method: "POST", body: data, }
            );
        },
        async downloadAttachment(identifier: string, name: string): Promise<DownloadedFile> {
            return download(
                baseUrl,
                `api/v1/admin/attachments/${identifier}/download`,
                { defaultFilename: name }
            );
        }
    }
}

export type AttachmentService = ReturnType<typeof createAttachmentService>;

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
import { ConnectorMessage, ConnectorMessageDetailsResponse } from "@/types/response/message";
import { ConnectorTransportStep } from "@/types/response/transport-step";
import { SendMessageFormData, SendMessageResponse, SendParameters, } from "@/types/send-message-form";
import { createSoapOutboundMessagePayload } from "@/lib/rest/message-outbound/soap-message-builder";
import { createRestOutboundMessagePayLoad } from "@/lib/rest/message-outbound/rest-message-builder";
import { ConnectorMessageStats } from "@/types/response/stats";
import { ConnectorMessageReportResponse } from "@/types/response/reporting";
import { DownloadedFile, RestApiCall, restApiCall, RestApiDownloadCall } from "@/lib/rest";
import { createAttachmentService } from "@/services/attachment";

const MESSAGE_REPORT_EXPORT_FORMATS = {
    CSV: "csv",
    JSON: "json",
    XLSX: "xlsx",
} as const;

const getExportExtension = (format: MessageReportExportFormat,): string => {
    return MESSAGE_REPORT_EXPORT_FORMATS[format];
}

export type MessageReportExportFormat = keyof typeof MESSAGE_REPORT_EXPORT_FORMATS;

export type ListMessageParams = {
    page?: number,
    size?: number,
    identifier?: string,
    backendName?: string,
    direction?: string,
    businessDomain?: string,
    service?: string
}

export type GetMessageReportParams = {
    from?: string;
    to?: string;
    businessDomain?: string;
}

export type ExportMessageReportsParams = {
    from?: string;
    to?: string;
    format: MessageReportExportFormat
}

interface SendMessageArgs {
    messageFormData: SendMessageFormData;
    parameters: SendParameters;
    asTestMessage: boolean;
}

export function createMessageService(baseUrl: string, bffUrl: string, call: RestApiCall, download: RestApiDownloadCall) {
    return {
        async listMessages(params?: ListMessageParams):
            Promise<PaginatedResponse<ConnectorMessage>> {
            return call<PaginatedResponse<ConnectorMessage>>(
                baseUrl,
                "api/v1/admin/messages",
                { params }
            );
        },
        async retrieveMessage(identifier: string): Promise<ConnectorMessageDetailsResponse> {
            return call<ConnectorMessageDetailsResponse>(baseUrl, `api/v1/admin/messages/${identifier}`);
        },
        async getMessageTransportStep(identifier: string): Promise<ConnectorTransportStep> {
            return call<ConnectorTransportStep>(baseUrl, `api/v1/admin/messages/${identifier}/transport-steps`);
        },
        async getMessageStats(params: { from?: string; to?: string; businessDomain?: string; }): Promise<ConnectorMessageStats> {
            return call<ConnectorMessageStats>(
                baseUrl,
                "api/v1/admin/messages/stats",
                { params }
            );
        },
        async getMessageReports(params: GetMessageReportParams): Promise<ConnectorMessageReportResponse> {
            return call<ConnectorMessageReportResponse>(
                baseUrl,
                "api/v1/admin/messages/reports",
                { params }
            );
        },
        async sendMessage({ messageFormData, parameters, asTestMessage}: SendMessageArgs): Promise<SendMessageResponse> {
            const repeatCount = Math.max(1, parameters.repeatCount || 1);
            let lastResponse: SendMessageResponse = {};

            for (let i = 0; i < repeatCount; i++) {
                // Each iteration rebuilds the payload so empty message IDs get fresh UUIDs.
                if (parameters.mode === "REST") {
                    lastResponse = await sendRestMessage(baseUrl, call, download, { messageFormData, parameters, asTestMessage });
                } else {
                    lastResponse = await sendSoapMessage(bffUrl, call, { messageFormData, parameters, asTestMessage });
                }
            }

            return lastResponse;
        },
        async exportMessageReports(params: ExportMessageReportsParams): Promise<DownloadedFile> {
            return download(
                baseUrl,
                "api/v1/admin/messages/reports/export",
                {
                    params, defaultFilename: `message-report.${getExportExtension(params.format)}`,
                }
            );
        }
    }
}

async function sendRestMessage(baseUrl: string, call: RestApiCall, download: RestApiDownloadCall, {
    messageFormData,
    parameters,
    asTestMessage
}: SendMessageArgs): Promise<SendMessageResponse> {
    void messageFormData;
    void parameters;
    void document;

    const payload = await createRestOutboundMessagePayLoad(
        createAttachmentService(baseUrl, call, download),
        asTestMessage,
        messageFormData,
        parameters
    );

    const path = asTestMessage ? "/api/v1/admin/messages/outbound/test" : "api/v1/messages/outbound";

    return restApiCall(
        baseUrl,
        path,
        { method: "POST", body: payload, }
    )
}

async function sendSoapMessage(bffUrl: string, call: RestApiCall, { messageFormData, parameters }: SendMessageArgs): Promise<SendMessageResponse> {
    void messageFormData;
    void parameters;
    void document;

    const payload = await createSoapOutboundMessagePayload(messageFormData);

    return call<SendMessageResponse>(
        bffUrl,
        "bff/api/v1/submit-message",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    )
}

export type MessageService = ReturnType<typeof createMessageService>;

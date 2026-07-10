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
import { ConnectorMessage, ConnectorMessageDetails } from "@/types/response/message";
import { ConnectorTransportStep } from "@/types/response/transport-step";
import { createSoapOutboundMessagePayload } from "@/utils/message-outbound/soap-message-builder";
import { createRestOutboundMessagePayLoad } from "@/utils/message-outbound/rest-message-builder";
import { ConnectorMessageStats } from "@/types/response/stats";
import { ConnectorMessageReport } from "@/types/response/reporting";
import { DownloadedFile, restApiCall, restApiDownload } from "@/lib/rest";
import { BFF_API_BASE_URL } from "@/lib/config";
import { PayloadGenerationMode, RequestMode, SendMessageArgs, SendMessageResponse, SendParameters, } from "@/types/send-message-form";


export async function listMessages(params?: {
    page?: number,
    size?: number,
    identifier?: string,
    backendName?: string
}):
    Promise<PaginatedResponse<ConnectorMessage>> {
    return restApiCall<PaginatedResponse<ConnectorMessage>>("api/v1/admin/messages", {
            params
        }
    );
}

export async function getMessage(identifier: string): Promise<ConnectorMessageDetails> {
    return restApiCall<ConnectorMessageDetails>(`api/v1/admin/messages/${identifier}`);
}

export async function getMessageTransportStep(identifier: string): Promise<ConnectorTransportStep> {
    return restApiCall<ConnectorTransportStep>(`api/v1/admin/messages/${identifier}/transport-steps`);
}

export async function getMessageStats(params: { from?: string; to?: string; }): Promise<ConnectorMessageStats> {
    return restApiCall<ConnectorMessageStats>("api/v1/admin/messages/stats", {
        params
    });
}

export async function getMessageReports(params: { from?: string; to?: string; }): Promise<ConnectorMessageReport> {
    return restApiCall<ConnectorMessageReport>("api/v1/admin/messages/reports", {
        params
    });
}

const MESSAGE_REPORT_EXPORT_FORMATS = {
    CSV: "csv",
    JSON: "json",
    XLSX: "xlsx",
} as const;

function getExportExtension(format: MessageReportExportFormat,): string {
    return MESSAGE_REPORT_EXPORT_FORMATS[format];
}

export type MessageReportExportFormat = keyof typeof MESSAGE_REPORT_EXPORT_FORMATS;

export async function exportMessageReports(params: { from?: string; to?: string; format: MessageReportExportFormat }): Promise<DownloadedFile> {
    return restApiDownload("api/v1/admin/messages/reports/export", {
        params, defaultFilename: `message-report.${getExportExtension(params.format)}`,
    });
}

export async function sendMessage({
                                      formData,
                                      parameters,
                                      documents,
                                  }: SendMessageArgs): Promise<SendMessageResponse[]> {
    if (parameters.mode === RequestMode.REST) {
        return sendRestMessage({formData, parameters, documents});
    }
    return sendSoapMessage({formData, parameters, documents});

}

async function sendRestMessage({
                                   formData,
                                   parameters,
                                   documents,
                               }: SendMessageArgs): Promise<SendMessageResponse[]> {

    const payload = await createRestOutboundMessagePayLoad(formData, parameters, documents);

    const createRequest = async () => {
        const payload = await createRestOutboundMessagePayLoad(
            formData,
            parameters,
            documents
        );
        return restApiCall<SendMessageResponse>(
            "api/v1/messages/outbound",
            {
                method: "POST",
                body: payload,
            }
        );
    };

    return await executeRepeatedRestRequest(parameters, createRequest);
}


async function sendSoapMessage({
                                   formData,
                                   parameters,
                                   documents,
                               }: SendMessageArgs): Promise<SendMessageResponse[]> {

    // pregenerate payloads
    const docs = documents?.length ? documents : [undefined];
    const payloads = await Promise.all(
        docs.map((document) =>
            createSoapOutboundMessagePayload(
                formData,
                parameters,
                document
            )
        )
    );

    const createRequests = () =>
        payloads.map((payload) =>
            restApiCall<SendMessageResponse>(
                "bff/api/v1/submit-message",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
                BFF_API_BASE_URL
            )
        );
    return await executeRepeatedSoapRequest(parameters, createRequests);

}

async function executeRepeatedSoapRequest(parameters: SendParameters, createRequests: () => Promise<SendMessageResponse>[]) {
    if (parameters.payloadGenerationMode === PayloadGenerationMode.SEQUENTIAL) {
        const results: PromiseSettledResult<SendMessageResponse>[] = [];

        for (let i = 0; i < parameters.repeatCount; i++) {
            results.push(...(await Promise.allSettled(createRequests())));
        }
        return results;
    }

    return Promise.allSettled(
        Array.from({length: parameters.repeatCount}).flatMap(createRequests)
    );
}

async function executeRepeatedRestRequest(parameters: SendParameters, createRequest: () => Promise<SendMessageResponse>) {
    if (parameters.payloadGenerationMode === PayloadGenerationMode.SEQUENTIAL) {
        const results: PromiseSettledResult<SendMessageResponse>[] = [];

        for (let i = 0; i < parameters.repeatCount; i++) {
            results.push(await createRequest().then(
                value => ({status: "fulfilled", value} as const),
                reason => ({status: "rejected", reason} as const)
            ));
        }
        return results;
    }

    return Promise.allSettled(
        Array.from({length: parameters.repeatCount}, createRequest)
    );
}
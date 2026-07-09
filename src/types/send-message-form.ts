/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import {ConnectorMessage} from "@/types/response/message";

export type SendMessageFormData = Pick<
    ConnectorMessage,
    "businessDomainIdentifier" | "backendMessageIdentifier" | "backendName" | "as4Properties"
>;


export enum FileSourceMode {
    GENERATED = "GENERATED",
    UPLOADED = "UPLOADED",
}

export enum RequestMode {
    SOAP = "SOAP",
    REST = "REST"
}


export interface SendParameters {
    mode: RequestMode;
    attachmentSizeMB: number;
    repeatCount: number;
    fileSource: FileSourceMode;
}

export interface UploadedAttachment {
    id: string;
}

export interface SendMessageResponse {
    identifier?: string;
    status?: string;
}

export interface SendMessageArgs {
    formData: SendMessageFormData;
    parameters: SendParameters;
    documents?: Blob[];
}

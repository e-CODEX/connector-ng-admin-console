/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { BusinessDocumentAesType, DetachedSignatureMimeType } from "@/types/global";

export interface RestOutboundMessageRequest {
    businessDomainIdentifier: string;
    backendMessageIdentifier: string;
    backendName?: string;
    attachments: string[];
    as4Properties: As4PropertiesRequest;
    businessContent: RestOutboundMessageContent
}

export interface SoapOutboundMessageRequest {
    messageDetails: SoapOutboundMessageDetails;
    messageContent: SoapOutboundMessageContent;
}

export interface SoapOutboundMessageDetails {
    backendMessageIdentifier: string;
    as4Properties: As4PropertiesRequest;
}

export interface As4PropertiesRequest {
    ebmsIdentifier: string;
    conversationIdentifier: string;
    referenceToIdentifier?: string;
    originalSender: string;
    finalRecipient: string;
    service: ServiceInfoRequest;
    action: ActionInfoRequest;
    fromParty: PartyInfoRequest
    toParty: PartyInfoRequest;
}

interface SoapOutboundMessageContent {
    xmlContent: string;
    document: {
        document?: string; // TODO une multipart for the document and its name
        documentName?: string;
        detachedSignature?: DetachedSignature;
        aesType: BusinessDocumentAesType;
    };
}

export interface RestOutboundMessageContent {
    xmlContent?: File
    businessDocument?: BusinessDocumentInfo;
}

export interface ServiceInfoRequest {
    name: string;
    type: string;
}

export interface ActionInfoRequest {
    name: string;
}

export interface PartyInfoRequest {
    identifier: string;
    identifierType: string;
    role: string;
}

interface DetachedSignature {
    signature: File;
    mimeType: DetachedSignatureMimeType;
}

export interface BusinessDocumentInfo {
    document?: File;
    detachedSignature?: DetachedSignature;
    aesType?: BusinessDocumentAesType;
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { BusinessDocumentAesType } from "@/types/global";

export interface SendMessageResponse {
    identifier: string;
}

export interface SoapSendMessageResponse {
    messageId: string;
}

export interface RestOutboundMessageRequest {
    businessDomainIdentifier: string;
    backendMessageIdentifier: string;
    backendName?: string;
    attachments: string[];
    as4Properties: As4Properties;
    businessContent: RestOutboundMessageContent
}

export interface SoapOutboundMessageRequest {
    messageDetails: SoapOutboundMessageDetails;
    messageContent: SoapOutboundMessageContent;
}

export interface SoapOutboundMessageDetails {
    backendMessageIdentifier: string;
    as4Properties: As4Properties;
}

export interface As4Properties {
    ebmsMessageIdentifier?: string;
    conversationIdentifier: string;
    referenceToIdentifier?: string;
    originalSender: string;
    finalRecipient: string;
    service: ServiceInfo;
    action: ActionInfo;
    fromParty: PartyInfo
    toParty: PartyInfo;
}

interface SoapOutboundMessageContent {
    xmlContent: string;
    document: BusinessDocumentInfo;
}


interface RestOutboundMessageContent {
    businessDocument: BusinessDocumentInfo;
}

interface ServiceInfo {
    name: string;
    type: string;
}

interface ActionInfo {
    name: string;
}

interface PartyInfo {
    identifier: string;
    identifierType: string;
    role: string;
}

interface DetachedSignature {
    signature: string;
    mimeType: string;
    name: string;
}

interface BusinessDocumentInfo {
    document?: string;
    documentName?: string;
    detachedSignature?: DetachedSignature;
    aesType: BusinessDocumentAesType;
}

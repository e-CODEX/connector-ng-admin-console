/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { ConnectorProcessingModeAction, ConnectorProcessingModeParty, ConnectorProcessingModeService } from "@/types/response/processing-mode";
import { BusinessDocumentAesType, ConnectorEvidenceType, DetachedSignatureMimeType, MessageDirection } from "@/types/global";


export interface ConnectorMessage {
    businessDomainIdentifier: string;
    identifier: string;
    backendMessageIdentifier: string;
    backendName: string;
    gatewayName: string;
    direction: MessageDirection;
    as4Properties: ConnectorAS4Properties;
    delivered: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    rejectedAt: string;
    confirmedAt: string;
    deliveredToLinkPartnerAt: string;
}

export interface ConnectorMessageDetailsResponse extends ConnectorMessage {
    businessContent?: ConnectorMessageBusinessContent;
    attachments?: ConnectorAttachmentResponse[];
    evidences: ConnectorMessageEvidence[];
    errors?: ConnectorMessageError[];
}

export interface ConnectorMessageBusinessContent {
    xmlContent: ConnectorAttachmentResponse;
    businessDocument: ConnectorMessageBusinessDocument;
}

interface ConnectorMessageBusinessDocument {
    attachment: ConnectorAttachmentResponse;
    aesType: BusinessDocumentAesType;
    detachedSignature: ConnectorMessageBusinessDocumentDetachedSignature;
}

interface ConnectorMessageBusinessDocumentDetachedSignature {
    signature: string;
    name: string;
    mimeType: DetachedSignatureMimeType;
}

interface ConnectorAS4Properties {
    ebmsMessageIdentifier: string;
    referenceToIdentifier: string;
    conversationIdentifier: string;
    originalSender: string;
    finalRecipient: string;
    fromParty: ConnectorProcessingModeParty;
    toParty: ConnectorProcessingModeParty;
    service: ConnectorProcessingModeService;
    action: ConnectorProcessingModeAction;
}

export interface ConnectorMessageEvidence {
    uuid: string;
    type: ConnectorEvidenceType;
    createdAt: string;
    updatedAt: string;
    deliveredToLinkPartnerAt: string;
}

interface ConnectorMessageError {
    label: string;
    details: string;
    source: string;
    createdAt: string;
    updatedAt: string;
}

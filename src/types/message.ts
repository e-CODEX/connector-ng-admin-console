/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorAttachment } from "@/types/attachments";
import { ConnectorAction, ConnectorParty, ConnectorService } from "@/types/processing-mode";

export type MessageDirection = "BACKEND_TO_GATEWAY" | "GATEWAY_TO_BACKEND";

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
    deliveredToGatewayAt: string;
    deliveredToBackendAt: string;
}

export interface ConnectorMessageDetails extends ConnectorMessage {
    businessContent: ConnectorMessageBusinessContent;
    attachments: ConnectorAttachment[];
    evidences: ConnectorMessageEvidence[];
    errors: ConnectorMessageError[];
}

interface ConnectorMessageBusinessContent {
    type: string;
    content: string;
}

interface ConnectorAS4Properties {
    ebmsMessageIdentifier: string;
    referenceToIdentifier: string;
    conversationIdentifier: string;
    originalSender: string;
    finalRecipient: string;
    fromParty: ConnectorParty;
    toParty: ConnectorParty;
    service: ConnectorService;
    action: ConnectorAction;
}

interface ConnectorMessageEvidence {
    uuid: string;
    type: string;
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

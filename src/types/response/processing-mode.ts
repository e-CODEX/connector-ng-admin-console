/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { KeystoreType, PartyRoleType } from "@/types/global";

export interface ConnectorProcessingMode {
    uuid: string;
    description: string;
    filename: string;
    businessDomainIdentifier: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConnectorProcessingModeDetail extends ConnectorProcessingMode {
    parties: ConnectorProcessingModeParty[];
    services: ConnectorProcessingModeService[];
    actions: ConnectorProcessingModeAction[];
    truststore: ConnectorProcessingModeTruststore;
}

export interface ConnectorProcessingModeParty {
    name: string;
    identifier: string;
    identifierType: string;
    role: string;
    roleType: PartyRoleType;
    isHome: boolean;
}

export interface ConnectorProcessingModeService {
    name: string;
    type: string;
    testOnly?: boolean;
}

export interface ConnectorProcessingModeAction {
    name: string;
    testOnly?: boolean;
}

export interface ConnectorProcessingModeTruststore {
    filename: string;
    password: string;
    type: KeystoreType;
    certificateInfo: ConnectorProcessingModeTruststoreCertificateInfo[]
}

export interface ConnectorProcessingModeTruststoreCertificateInfo {
    alias: string;
    entryType: string;
    subject: string;
    issuer: string;
    serialNumber: string;
    notBefore: string;
    notAfter: string;
    signatureAlgorithm: string;
    keyAlgorithm: string;
    validity: string;
}

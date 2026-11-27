/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ConnectorBusinessDomain } from "@/types/response/business-domain";
import type { BusinessDocumentAesType, KeystoreType } from "@/types/global";

export interface LinkPartnerConfiguration {
    backend: BackendPartner[];
}

export interface BackendPartner {
    linkConfig: LinkConfig;
    linkPartners: LinkPartner[];
}

export interface LinkConfig {
    name: string;
    properties: LinkProperties;
}

export interface LinkProperties {
    endpoint: Endpoint;
    publishAddress: string;
    loggingEnabled: boolean;
    wsPolicy: string;
}

export interface Endpoint {
    keystore: Keystore;
    privateKey: PrivateKey;
    truststore: Keystore;
    encryptAlias: string;
}

export interface LinkPartner {
    name: string;
    description: string;
    enabled: boolean;
    receiverMode: string;
    senderMode: string;
    properties: LinkPartnerProperties;
}

export interface LinkPartnerProperties {
    encryptionAlias: string;
    certificateDn: string;
    pushAddress: string;
}

// business domain config

export interface BusinessDomainConfiguration {
    defaults: ConnectorBusinessDomain[];
}

// message verification

export type MessageVerificationMode = "STRICT" | "RELAXED";

export interface MessageProcessingConfiguration {
    ebmsIdGeneratorEnabled: boolean;
    identifierSuffix: string;
    ebmsIdSuffix: string;
    transportIdSuffix: string;
    outboundMessageVerificationMode: MessageVerificationMode;
    inboundMessageVerificationMode: MessageVerificationMode;
    sendGeneratedEvidencesToBackend: boolean;
    autoTriggerDeliveryEvidences: boolean;
}

// queue config

export interface QueueConfiguration {
    outboundMessageStagingQueue: string;
    outboundEvidenceTriggerQueue: string;
    outboundMessageProcessingQueue: string;
    inboundMessageStagingQueue: string;
    inboundMessageProcessingQueue: string;
    inboundEvidenceTriggerQueue: string;
    backendDeliveryQueue: string;
    gatewaySubmissionQueue: string;
    gatewaySubmissionReplyQueue: string;
    gatewayReceptionQueue: string;
    resolvedMessageCleanupProcessingQueue: string;
}

// routing config

export interface BackendRule {
    linkName: string;
    matchClause: string;
}

export interface RoutingConfiguration {
    enabled: boolean;
    defaultBackendName: string;
    backendRules: BackendRule[];
}

// container
export interface ContainerZipConfiguration {
    maxEntries: number;
    maxEntrySize: number;
    maxTotalSize: number;
}

export interface ContainerConfiguration {
    signature: Signature;
    zip: ContainerZipConfiguration;
}

// evidence config

export interface EvidenceConfiguration {
    signature: Signature;
    issuer: Issuer;
}

export interface Issuer {
    postalAddress: PostalAddress;
    as4Party: As4Party;
}

export interface PostalAddress {
    street: string;
    locality: string;
    zipCode: string;
    country: string;
}

export interface As4Party {
    name: string;
    endpointAddress: string;
}

// business document
export interface AuthenticationValidation {
    identityProvider: string;
}

export interface BusinessDocumentConfiguration {
    country: string;
    serviceProvider: string;
    defaultAdvancedSystemType: BusinessDocumentAesType;
    authenticationValidation: AuthenticationValidation;
    signature: Signature;
}

// common

export interface Signature {
    encryptionAlgorithm: string;
    digestAlgorithm: string;
    keystore: Keystore;
    privateKey: PrivateKey;
    validation: Validation;
}

export interface Keystore {
    path: string;
    password: string;
    type: KeystoreType;
}

export interface PrivateKey {
    alias: string;
    password: string;
}

export interface Validation {
    ocspEnabled: boolean;
    crlEnabled: boolean;
    aiaEnabled: boolean;
    truststoreEnabled: boolean;
    ignoreStoreEnabled: boolean;
    trustedListSource: string;
    truststore: Keystore;
    ignoreStore: Keystore;
    constraintsXml: string;
}

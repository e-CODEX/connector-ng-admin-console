/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export type MessageDirection = "BACKEND_TO_GATEWAY" | "GATEWAY_TO_BACKEND";

export type HealthStatus = | "UP" | "DOWN" | "DEGRADED" | "UNKNOWN";

export type AttachmentStorageType = "S3_BUCKET" | "LOCAL_FILE_SYSTEM";

export type AttachmentType =
    "ATTACHMENT"
    | "ASICS"
    | "BUSINESS_CONTENT"
    | "BUSINESS_DOCUMENT"
    | "DETACHED_SIGNATURE"
    | "EVIDENCE_XML"
    | "PDF_TOKEN"
    | "XML_TOKEN";

export type KeystoreType = "JKS" | "PKCS12";

export type TransportStepMessageType = "BUSINESS" | "EVIDENCE";

export type TransportStepStatus = "DELIVERED" | "FAILED" | "SUBMITTED" | "PULLED" | "READY_FOR_PULL";

export type BusinessDocumentAesType = "SIGNATURE_BASED" | "AUTHENTICATION_BASED";

export type PartyRoleType = "INITIATOR" | "RESPONDER";

export type LinkPartnerType = "BACKEND" | "GATEWAY";

export type DetachedSignatureMimeType = "BINARY" | "XML" | "PKCS7";

export type ConnectorEvidenceType =
    | "SUBMISSION_ACCEPTANCE"
    | "SUBMISSION_REJECTION"
    | "RELAY_REMMD_ACCEPTANCE"
    | "RELAY_REMMD_REJECTION"
    | "RELAY_REMMD_FAILURE"
    | "DELIVERY"
    | "NON_DELIVERY"
    | "RETRIEVAL"
    | "NON_RETRIEVAL";

export type ConnectorMessageStatus =
    | 'CREATED'
    | 'FAILED'
    | 'SUBMITTED'
    | 'DELIVERED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'DELETED'
    | 'READY_FOR_PULL'
    | 'RECEIVED_BY_OPPOSITE_CONNECTOR'
    | 'PULLED';

export const ACCEPTED_TRUSTSTORES = [
    "application/x-pkcs12",
    "application/pkcs12",
    "application/octet-stream",
    "application/x-java-keystore",
    ".jks",
    ".keystore",
    ".p12",
    ".pfx",
];

export type USER_ROLE = "ROLE_ADMIN" | "ROLE_USER" | "LOAD_TESTER" ;

export const APP_MODES = ["ADMIN_CONSOLE", "TESTING_CONSOLE"] as const;

export type AppMode = (typeof APP_MODES)[number];

export type OutboundMessageRequestMode = "SOAP" | "REST";

export const ACCEPTED_XMLS = ["application/xml", "text/xml", ".xml"] as string[];

export const ALL_SELECTOR = "All";

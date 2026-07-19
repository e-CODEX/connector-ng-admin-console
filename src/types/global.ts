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

export type KeystoreType = "JKS" | "PKCS12";

export type TransportStepMessageType = "BUSINESS" | "EVIDENCE";

export type TransportStepStatus = "DELIVERED" | "FAILED" | "SUBMITTED" | "DOWNLOADED" | "READY_FOR_DOWNLOAD";

export type BusinessDocumentAesType = "SIGNATURE_BASED" | "AUTHENTICATION_BASED";

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { z } from "zod";
import type { ConnectorEvidenceType, OutboundMessageRequestMode } from "@/types/global";

export const CONNECTOR_EVIDENCE_TYPES = [
    "SUBMISSION_ACCEPTANCE",
    "SUBMISSION_REJECTION",
    "RELAY_REMMD_ACCEPTANCE",
    "RELAY_REMMD_REJECTION",
    "RELAY_REMMD_FAILURE",
    "DELIVERY",
    "NON_DELIVERY",
    "RETRIEVAL",
    "NON_RETRIEVAL",
] as const satisfies readonly ConnectorEvidenceType[];

export const OUTBOUND_MESSAGE_REQUEST_MODES = ["SOAP", "REST"] as const satisfies readonly OutboundMessageRequestMode[];

export const messageEvidenceTriggerSchema = z.object({
    payload: z.object({
        referenceToMessageIdentifier: z.string().trim().min(1, "referenceToMessageIdentifier is required"),
        evidenceType: z.enum(CONNECTOR_EVIDENCE_TYPES, {
            error: "evidenceType is required",
        }),
    }),
    mode: z.enum(OUTBOUND_MESSAGE_REQUEST_MODES, {
        error: "evidence trigger mode is required",
    }),
});

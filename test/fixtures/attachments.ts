/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ConnectorAttachmentResponse } from "@/types/response/attachments";

export const ATTACHMENT_ID =
    "e62d9391-2ef7-4368-b437-f57eb199a27c-businessDocument.pdf";
export const anAttachment = (
    overrides: Partial<ConnectorAttachmentResponse> = {},
): ConnectorAttachmentResponse => ({
    identifier: ATTACHMENT_ID,
    name: "Form_A.pdf",
    contentType: "application/pdf",
    size: 2048,
    description: "Form_A",
    storage: "S3_BUCKET",
    type: "BUSINESS_DOCUMENT",
    createdAt: "2026-11-12T10:00:00Z",
    updatedAt: "2026-11-12T10:00:00Z",
    deletedAt: null as unknown as string,
    ...overrides,
});

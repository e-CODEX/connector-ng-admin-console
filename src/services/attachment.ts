/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { PaginatedResponse } from "@/types/paginated-response";
import { restApiCall } from "@/lib/http";
import { UploadAttachmentResponse } from "@/lib/http/attachment";
import { ConnectorAttachment } from "@/types/attachments";

export async function listAttachments(params?: {
    page?: number,
    size?: number
}):
    Promise<PaginatedResponse<ConnectorAttachment>> {
    return restApiCall<PaginatedResponse<ConnectorAttachment>>(
        "api/v1/admin/attachments",
        { params }
    );
}

export function uploadMessageAttachment(file: Blob) {
  const data = new FormData();
  data.append("attachments", file, "business-document.pdf");

  return restApiCall<UploadAttachmentResponse[]>(
    "api/v1/attachments/upload",
    {
      method: "POST",
      body: data,
    }
  );
}
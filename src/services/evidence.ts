/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { DownloadedFile, RestApiDownloadCall } from "@/lib/rest";

export function createEvidenceService(baseUrl: string, call: RestApiDownloadCall) {
    return {
        async downloadEvidence(uuid: string, evidenceType: string): Promise<DownloadedFile> {
            return call(
                baseUrl,
                `api/v1/evidences/${uuid}/download`,
                { defaultFilename: `${evidenceType.toLowerCase()}.xml` }
            );
        }
    }
}

export type EvidenceService = ReturnType<typeof createEvidenceService>;

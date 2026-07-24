/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { DownloadedFile, restApiDownload } from "@/lib/rest";

export function createEvidenceService(baseUrl: string) {
    return {
        async downloadEvidence(uuid: string, evidenceType: string): Promise<DownloadedFile> {
            const params = { defaultFilename: `${evidenceType.toLowerCase()}.xml` }
            return restApiDownload(
                baseUrl,
                `api/v1/evidences/${uuid}/download`,
                { params }
            );
        }
    }
}

export type EvidenceService = ReturnType<typeof createEvidenceService>;

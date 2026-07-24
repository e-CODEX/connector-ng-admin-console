/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorBusinessDomain } from "@/types/response/business-domain";
import { BusinessDomainCreationRequest } from "@/types/request/business-domain";
import { restApiCall } from "@/lib/rest";


export function createBusinessDomainService(baseUrl: string) {
    return {
        async listBusinessDomains(): Promise<ConnectorBusinessDomain[]> {
            return restApiCall<ConnectorBusinessDomain[]>(baseUrl, "api/v1/admin/business-domains");
        },
        async createBusinessDomain(payload: BusinessDomainCreationRequest): Promise<ConnectorBusinessDomain> {
            return restApiCall<ConnectorBusinessDomain>(
                baseUrl,
                "api/v1/admin/business-domains", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            )
        }
    }
}

export type BusinessDomainService = ReturnType<typeof createBusinessDomainService>;

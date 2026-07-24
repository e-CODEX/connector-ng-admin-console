/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { restApiCall } from "@/lib/rest";
import {
    BusinessDocumentConfiguration,
    BusinessDomainConfiguration,
    ContainerConfiguration,
    EvidenceConfiguration,
    LinkPartnerConfiguration,
    MessageProcessingConfiguration,
    QueueConfiguration,
    RoutingConfiguration
} from "@/types/response/configuration";

export function createConfigurationService(baseUrl: string) {
    return {
        async getBusinessDomainsConfig(): Promise<BusinessDomainConfiguration> {
            return restApiCall<BusinessDomainConfiguration>(baseUrl, "api/v1/admin/configurations/business-domains");
        },
        async getEvidenceConfiguration(): Promise<EvidenceConfiguration> {
            return restApiCall<EvidenceConfiguration>(baseUrl, "api/v1/admin/configurations/evidence");
        },
        async getContainerConfiguration(): Promise<ContainerConfiguration> {
            return restApiCall<ContainerConfiguration>(baseUrl, "api/v1/admin/configurations/container");
        },
        async getBusinessDocumentConfiguration(): Promise<BusinessDocumentConfiguration> {
            return restApiCall<BusinessDocumentConfiguration>(baseUrl, "api/v1/admin/configurations/business-document");
        },
        async getMessageProcessingConfiguration(): Promise<MessageProcessingConfiguration> {
            return restApiCall<MessageProcessingConfiguration>(baseUrl, "api/v1/admin/configurations/message-processing");
        },
        async getQueueConfiguration(): Promise<QueueConfiguration> {
            return restApiCall<QueueConfiguration>(baseUrl, "api/v1/admin/configurations/queues");
        },
        async getRoutingConfiguration(): Promise<RoutingConfiguration> {
            return restApiCall<RoutingConfiguration>(baseUrl, "api/v1/admin/configurations/routing");
        },
        async getLinkPartnerConfiguration(): Promise<LinkPartnerConfiguration> {
            return restApiCall(baseUrl, "api/v1/admin/configurations/backend-link-partners");
        }
    }
}

export type ConfigurationService = ReturnType<typeof createConfigurationService>;

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
    EvidenceConfiguration, LinkPartnerConfiguration,
    MessageProcessingConfiguration,
    QueueConfiguration,
    RoutingConfiguration
} from "@/types/configuration";

export async function getBusinessDomainsConfig(): Promise<BusinessDomainConfiguration> {
    return restApiCall<BusinessDomainConfiguration>("api/v1/admin/configurations/business-domains");
}

export async function getEvidenceConfiguration(): Promise<EvidenceConfiguration> {
    return restApiCall<EvidenceConfiguration>("api/v1/admin/configurations/evidence");
}

export async function getContainerConfiguration(): Promise<ContainerConfiguration> {
    return restApiCall<ContainerConfiguration>("api/v1/admin/configurations/container");
}

export async function getBusinessDocumentConfiguration(): Promise<BusinessDocumentConfiguration> {
    return restApiCall<BusinessDocumentConfiguration>("api/v1/admin/configurations/business-document");
}

export async function getMessageProcessingConfiguration(): Promise<MessageProcessingConfiguration> {
    return restApiCall<MessageProcessingConfiguration>("api/v1/admin/configurations/message-procesing");
}

export async function getQueueConfiguration(): Promise<QueueConfiguration> {
    return restApiCall<QueueConfiguration>("api/v1/admin/configurations/queues");
}

export async function getRoutingConfiguration(): Promise<RoutingConfiguration> {
    return restApiCall<RoutingConfiguration>("api/v1/admin/configurations/routing");
}

export async function getLinkPartnerConfiguration(): Promise<LinkPartnerConfiguration> {
    return restApiCall("api/v1/admin/configurations/backend-link-partners");
}

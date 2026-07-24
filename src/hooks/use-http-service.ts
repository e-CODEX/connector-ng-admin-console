/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client";

import { useMemo } from "react";
import { useAppConfig } from "@/hooks/use-app-config";
import { createActuatorService } from "@/services/actuator";
import { createAttachmentService } from "@/services/attachment";
import { createBusinessDomainService } from "@/services/business-domain";
import { createConfigurationService } from "@/services/configuration";
import { createEvidenceService } from "@/services/evidence";
import { createLinkPartnersService } from "@/services/link-partner";
import { createMessageService } from "@/services/message";
import { createProcessingModeService } from "@/services/processing-mode";
import { createQueueService } from "@/services/queue";
import { createTransportStepsService } from "@/services/transport-step";

export function useActuatorService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createActuatorService(apiUrl), [apiUrl]);
}

export function useAttachmentService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createAttachmentService(apiUrl), [apiUrl]);
}

export function useBusinessDomainService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createBusinessDomainService(apiUrl), [apiUrl]);
}

export function useConfigurationService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createConfigurationService(apiUrl), [apiUrl]);
}

export function useEvidenceService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createEvidenceService(apiUrl), [apiUrl]);
}

export function useLinkPartnerService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createLinkPartnersService(apiUrl), [apiUrl]);
}

export function useMessageService() {
    const { apiUrl, bffUrl } = useAppConfig();

    return useMemo(() => createMessageService(apiUrl, bffUrl), [apiUrl, bffUrl]);
}

export function useProcessingModeService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createProcessingModeService(apiUrl), [apiUrl]);
}

export function useQueueService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createQueueService(apiUrl), [apiUrl]);
}

export function useTransportStepService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createTransportStepsService(apiUrl), [apiUrl]);
}

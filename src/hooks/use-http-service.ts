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
import { createUserService } from "@/services/user";
import { restApiCall, restApiDownload } from "@/lib/rest";
import { createAuthService } from "@/services/auth";

const PROXY_BACKEND_API = "/api/backend"

export function useActuatorService() {
    const { apiUrl } = useAppConfig();

    return useMemo(() => createActuatorService(apiUrl), [apiUrl]);
}

export function useAttachmentService() {
    return useMemo(() => createAttachmentService(PROXY_BACKEND_API, restApiCall), []);
}

export function useBusinessDomainService() {
    return useMemo(() => createBusinessDomainService(PROXY_BACKEND_API, restApiCall), []);
}

export function useConfigurationService() {
    return useMemo(() => createConfigurationService(PROXY_BACKEND_API, restApiCall), []);
}

export function useEvidenceService() {
    return useMemo(() => createEvidenceService(PROXY_BACKEND_API, restApiDownload), []);
}

export function useLinkPartnerService() {
    return useMemo(() => createLinkPartnersService(PROXY_BACKEND_API, restApiCall), []);
}

export function useMessageService() {
    const { bffUrl } = useAppConfig();

    return useMemo(() => createMessageService(PROXY_BACKEND_API, bffUrl, restApiCall, restApiDownload), [bffUrl]);
}

export function useProcessingModeService() {
    return useMemo(() => createProcessingModeService(PROXY_BACKEND_API, restApiCall), []);
}

export function useQueueService() {
    return useMemo(() => createQueueService(PROXY_BACKEND_API, restApiCall), []);
}

export function useTransportStepService() {
    return useMemo(() => createTransportStepsService(PROXY_BACKEND_API, restApiCall), []);
}

export function useUserService() {
    return useMemo(() => createUserService(PROXY_BACKEND_API, restApiCall), []);
}

export function useAuthService() {
    return useMemo(() => createAuthService(PROXY_BACKEND_API, restApiCall), []);
}

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
import { ActuatorService, createActuatorService } from "@/services/actuator";
import { AttachmentService, createAttachmentService } from "@/services/attachment";
import { BusinessDomainService, createBusinessDomainService } from "@/services/business-domain";
import { ConfigurationService, createConfigurationService } from "@/services/configuration";
import { createEvidenceService, EvidenceService } from "@/services/evidence";
import { createLinkPartnersService, LinkPartnersService } from "@/services/link-partner";
import { createMessageService, MessageService } from "@/services/message";
import { createProcessingModeService, ProcessingModeService } from "@/services/processing-mode";
import { createQueueService, QueueService } from "@/services/queue";
import { createTransportStepsService, TransportStepsService } from "@/services/transport-step";
import { createUserService, UserService } from "@/services/user";
import { restApiCall, restApiDownload } from "@/lib/rest";
import { AuthService, createAuthService } from "@/services/auth";

const PROXY_BACKEND_API = "/api/backend"

export function useActuatorService(): ActuatorService {
    return useMemo(() => createActuatorService(PROXY_BACKEND_API, restApiCall), []);
}

export function useAttachmentService(): AttachmentService {
    return useMemo(() => createAttachmentService(PROXY_BACKEND_API, restApiCall, restApiDownload), []);
}

export function useBusinessDomainService(): BusinessDomainService {
    return useMemo(() => createBusinessDomainService(PROXY_BACKEND_API, restApiCall), []);
}

export function useConfigurationService(): ConfigurationService {
    return useMemo(() => createConfigurationService(PROXY_BACKEND_API, restApiCall), []);
}

export function useEvidenceService(): EvidenceService {
    return useMemo(() => createEvidenceService(PROXY_BACKEND_API, restApiDownload), []);
}

export function useLinkPartnerService(): LinkPartnersService {
    return useMemo(() => createLinkPartnersService(PROXY_BACKEND_API, restApiCall), []);
}

export function useMessageService(): MessageService {
    const { bffUrl } = useAppConfig();

    return useMemo(() => createMessageService(PROXY_BACKEND_API, bffUrl, restApiCall, restApiDownload), [bffUrl]);
}

export function useProcessingModeService(): ProcessingModeService {
    return useMemo(() => createProcessingModeService(PROXY_BACKEND_API, restApiCall, restApiDownload), []);
}

export function useQueueService(): QueueService {
    return useMemo(() => createQueueService(PROXY_BACKEND_API, restApiCall), []);
}

export function useTransportStepService(): TransportStepsService {
    return useMemo(() => createTransportStepsService(PROXY_BACKEND_API, restApiCall), []);
}

export function useUserService(): UserService {
    return useMemo(() => createUserService(PROXY_BACKEND_API, restApiCall), []);
}

export function useAuthService(): AuthService {
    return useMemo(() => createAuthService(PROXY_BACKEND_API, restApiCall), []);
}

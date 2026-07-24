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

import { ConnectorProcessingModeService } from "@/types/response/processing-mode";
import { useDomainScopedList } from "@/hooks/use-domain-scoped-list";
import { useProcessingModeService } from "@/hooks/use-http-service";

export function useProcessingModeServices(businessDomainIdentifier: string, allSelector?: string) {
    const processingModeService = useProcessingModeService();

    return useDomainScopedList<ConnectorProcessingModeService>(
        businessDomainIdentifier,
        processingModeService.listProcessingModeServices,
        { allSelector, allItem: (name) => ({ name, type: "*" }) },
    );
}

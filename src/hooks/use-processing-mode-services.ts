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

import { useEffect, useMemo, useState } from "react";
import { toastError } from "@/utils";
import { listProcessingModeServices } from "@/services/processing-mode";
import { ConnectorProcessingModeService } from "@/types/response/processing-mode";

interface UseProcessingModeServicesResult {
    items: ConnectorProcessingModeService[];
    isLoading: boolean;
}

interface FetchedServices {
    domain: string;
    data: ConnectorProcessingModeService[];
}

const EMPTY: ConnectorProcessingModeService[] = [];

export function useProcessingModeServices(businessDomainIdentifier: string, allSelector?: string): UseProcessingModeServicesResult {
    const [fetched, setFetched] = useState<FetchedServices | null>(null);

    const hasDomain = !!businessDomainIdentifier && businessDomainIdentifier !== allSelector;

    useEffect(() => {
        if (!hasDomain) return;

        let cancelled = false;

        listProcessingModeServices(businessDomainIdentifier)
            .then((data) => {
                if (cancelled) return;
                setFetched({ domain: businessDomainIdentifier, data });
            })
            .catch((error) => {
                if (cancelled) return;
                setFetched({ domain: businessDomainIdentifier, data: [] });
                toastError(error);
            });

        return () => {
            cancelled = true;
        };
    }, [businessDomainIdentifier, hasDomain]);

    const isCurrent = hasDomain && fetched?.domain === businessDomainIdentifier;

    const items = useMemo(() => {
        if (!isCurrent) return EMPTY;
        const data = fetched!.data;
        return allSelector ? [{ name: allSelector, type: "*" }, ...data] : data;
    }, [isCurrent, fetched, allSelector]);

    return { items, isLoading: hasDomain && !isCurrent };
}

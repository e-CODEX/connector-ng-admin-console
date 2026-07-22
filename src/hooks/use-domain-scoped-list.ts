/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useEffect, useMemo, useState } from "react";
import { toastError } from "@/utils";

interface UseDomainScopedListResult<T> {
    items: T[];
    isLoading: boolean;
}

interface Fetched<T> {
    domain: string;
    data: T[];
}

interface UseDomainScopedListOptions<T> {
    allSelector?: string;
    allItem?: (allSelector: string) => T;
}

const EMPTY: never[] = [];

export function useDomainScopedList<T>(
    businessDomainIdentifier: string,
    fetcher: (businessDomainIdentifier: string) => Promise<T[]>,
    { allSelector, allItem }: UseDomainScopedListOptions<T> = {},
): UseDomainScopedListResult<T> {
    const [fetched, setFetched] = useState<Fetched<T> | null>(null);
    const hasDomain = !!businessDomainIdentifier && businessDomainIdentifier !== allSelector;

    useEffect(() => {
        if (!hasDomain) return;
        let cancelled = false;

        fetcher(businessDomainIdentifier)
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
    }, [businessDomainIdentifier, hasDomain, fetcher]);

    const isCurrent = hasDomain && fetched?.domain === businessDomainIdentifier;

    const items = useMemo(() => {
        if (!isCurrent) return EMPTY as T[];
        const data = fetched!.data;
        return allSelector && allItem ? [allItem(allSelector), ...data] : data;
    }, [isCurrent, fetched, allSelector, allItem]);

    return { items, isLoading: hasDomain && !isCurrent };
}

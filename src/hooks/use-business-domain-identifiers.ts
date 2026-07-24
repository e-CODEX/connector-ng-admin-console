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

import { useEffect, useState } from "react";
import { toastError } from "@/utils";
import { useBusinessDomainService } from "@/hooks/use-http-service";

export function useBusinessDomainIdentifiers(allLabel?: string) {
    const businessDomainsService = useBusinessDomainService();

    const [identifiers, setIdentifiers] = useState<string[]>([]);

    useEffect(() => {
        let cancelled = false;

        businessDomainsService.listBusinessDomains()
            .then((domains) => {
                if (cancelled) return;
                const names = domains.map((d) => d.identifier);
                setIdentifiers(allLabel ? [allLabel, ...names] : names);
            })
            .catch((error) => {
                if (cancelled) return;
                toastError(error);
            });

        return () => {
            cancelled = true;
        };
    }, [allLabel, businessDomainsService]);

    return identifiers;
}

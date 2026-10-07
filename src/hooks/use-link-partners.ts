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
import { ConnectorLinkPartner } from "@/types/response/link-partner";
import { LinkPartnerType } from "@/types/global";
import { useLinkPartnerService } from "@/hooks/use-http-service";

export function useLinkPartners(linkType: LinkPartnerType, allLabel?: string) {
    const [partners, setPartners] = useState<ConnectorLinkPartner[]>([]);

    const linkPartnersService = useLinkPartnerService();

    useEffect(() => {
        let cancelled = false;

        linkPartnersService.listLinkPartners({ linkType })
            .then((linkPartners) => {
                if (cancelled) return;
                setPartners(
                    allLabel ?
                        [{ name: allLabel, enabled: true, description: "All", type: "BACKEND", testOnly: false }, ...linkPartners]
                        : linkPartners
                );
            })
            .catch((error) => {
                if (cancelled) return;
                toastError(error);
            });

        return () => {
            cancelled = true;
        };
    }, [allLabel, linkType, linkPartnersService]);

    return partners;
}

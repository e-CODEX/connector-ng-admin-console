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

import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationSignatureView } from "@/components/configuration/view/configuration-signature-view";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { EvidenceConfiguration } from "@/types/response/configuration";
import React, { useEffect, useState } from "react";
import { toastError } from "@/utils";
import { SpinnerView } from "@/components/common/spinner-view";
import { useConfigurationService } from "@/hooks/use-http-service";

export function ConfigurationEvidenceSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<EvidenceConfiguration | null>(null);

    const configurationService = useConfigurationService();

    useEffect(() => {
        const loadConfig = async () => {
            setLoading(true)
            try {
                const data = await configurationService.getEvidenceConfiguration()
                setConfig(data || null)
            } catch (error) {
                toastError(error)
            } finally {
                setLoading(false)
            }
        }

        (async () => {
            await loadConfig()
        })()
    }, [configurationService])

    if (!config) {
        return null;
    }

    const { postalAddress: a, as4Party } = config.issuer;
    const address = [a.street, a.locality, a.zipCode, a.country].filter(Boolean).join(", ");

    return (
        <div>
            {
                loading ? (
                    <SpinnerView className="mt-60"/>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ConfigurationBlock title="Signature" note="reused view">
                            <ConfigurationSignatureView signature={config.signature}/>
                        </ConfigurationBlock>
                        <ConfigurationBlock title="Issuer">
                            <dl>
                                <ConfigurationDetailRow label="AS4 name">{as4Party.name}</ConfigurationDetailRow>
                                <ConfigurationDetailRow label="AS4 endpoint">{as4Party.endpointAddress}</ConfigurationDetailRow>
                                <ConfigurationDetailRow label="Address">{address}</ConfigurationDetailRow>
                            </dl>
                        </ConfigurationBlock>
                    </div>
                )
            }
        </div>
    );
}

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
import { BusinessDocumentConfiguration } from "@/types/response/configuration";
import { getBusinessDocumentConfiguration } from "@/services/configuration";
import { toastError } from "@/utils";
import { Spinner } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationSignatureView } from "@/components/configuration/view/configuration-signature-view";

export function ConfigurationBusinessDocumentSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<BusinessDocumentConfiguration | null>(null);

    const loadConfig = async () => {
        setLoading(true)
        try {
            const data = await getBusinessDocumentConfiguration()
            setConfig(data || [])
        } catch (error) {
            toastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            await loadConfig()
        })()
    }, [])

    if (!config) {
        return null;
    }

    return (
        <div>
            {
                loading ? (
                    <div className="flex justify-center items-center min-h-400]">
                        <Spinner size="lg"/>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ConfigurationBlock title="Business document" note="Configured business document">
                            <ConfigurationDetailRow label="Country">
                                {config.country}
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Service provider">
                                {config.serviceProvider}
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Default advanced system type">
                                {config.defaultAdvancedSystemType}
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Authentication validation identity provider">
                                {config.authenticationValidation.identityProvider}
                            </ConfigurationDetailRow>
                            <ConfigurationSignatureView signature={config.signature}/>
                        </ConfigurationBlock>
                    </div>
                )
            }
        </div>
    )
}

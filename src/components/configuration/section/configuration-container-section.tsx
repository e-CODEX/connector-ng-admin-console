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
import { ContainerConfiguration } from "@/types/configuration";
import { getContainerConfiguration } from "@/services/configuration";
import { toastError } from "@/utils";
import { Spinner } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationSignatureView } from "@/components/configuration/configuration-signature-view";

export function ConfigurationContainerSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<ContainerConfiguration | null>(null);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const data = await getContainerConfiguration();
            setConfig(data || null);
        } catch (error) {
            toastError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await loadConfig();
        })()
    }, [])

    if (!config) {
        return null;
    }

    return (
        <>
            {
                loading ? (
                    <div className="flex justify-center items-center min-h-400]">
                        <Spinner size="lg"/>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ConfigurationBlock title="Signature" note="">
                            <ConfigurationSignatureView signature={config.signature}/>
                        </ConfigurationBlock>
                    </div>
                )
            }
        </>
    )
}

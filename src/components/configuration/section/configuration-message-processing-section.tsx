/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useEffect, useState } from "react";
import { MessageProcessingConfiguration } from "@/types/response/configuration";
import { getMessageProcessingConfiguration } from "@/services/configuration";
import { getBooleanLabel, toastError } from "@/utils";
import { Spinner } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationBoolChip } from "@/components/configuration/configuration-bool-chip";

export function ConfigurationMessageProcessingSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<MessageProcessingConfiguration | null>(null);

    const loadConfig = async () => {
        setLoading(true)
        try {
            const data = await getMessageProcessingConfiguration()
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
                        <ConfigurationBlock title="Message Processing" note="">
                            <ConfigurationDetailRow label="Connector identifier suffix">
                                {config.identifierSuffix}
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Ebms identifier generation enabled">
                                <ConfigurationBoolChip value={config.ebmsIdGeneratorEnabled} label={getBooleanLabel(config.ebmsIdGeneratorEnabled)}/>
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Ebms identifier suffix">
                                {config.ebmsIdSuffix}
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Send generated evidences to backend">
                                <ConfigurationBoolChip value={config.sendGeneratedEvidencesToBackend}
                                                       label={getBooleanLabel(config.sendGeneratedEvidencesToBackend)}/>
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Transport step identifier suffix">
                                {config.transportIdSuffix}
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Outbound message verification mode">
                                {config.outboundMessageVerificationMode}
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Inbound message verification mode">
                                {config.inboundMessageVerificationMode}
                            </ConfigurationDetailRow>
                        </ConfigurationBlock>
                    </div>
                )
            }
        </div>
    );
}

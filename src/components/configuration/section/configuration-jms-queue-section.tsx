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
import { QueueConfiguration } from "@/types/configuration";
import { getQueueConfiguration } from "@/services/configuration";
import { toastError } from "@/utils";
import { Spinner } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";

export function ConfigurationJmsQueueSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<QueueConfiguration | null>(null);

    const loadConfig = async () => {
        setLoading(true)
        try {
            const data = await getQueueConfiguration()
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
        <>
            {
                loading ? (
                    <div className="flex justify-center items-center min-h-400]">
                        <Spinner size="lg"/>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ConfigurationBlock title="Connector Queue" note="">
                            <ConfigurationDetailRow label="Outbound message staging queue">
                                {config.outboundMessageStagingQueue}
                            </ConfigurationDetailRow>

                            <ConfigurationDetailRow label="Outbound evidence trigger queue">
                                {config.outboundEvidenceTriggerQueue}
                            </ConfigurationDetailRow>

                            <ConfigurationDetailRow label="Outbound message processing queue">
                                {config.outboundMessageProcessingQueue}
                            </ConfigurationDetailRow>

                            <ConfigurationDetailRow label="Inbound message processing queue">
                                {config.inboundMessageProcessingQueue}
                            </ConfigurationDetailRow>

                            <ConfigurationDetailRow label="Inbound evidence trigger queue">
                                {config.inboundEvidenceTriggerQueue}
                            </ConfigurationDetailRow>

                            <ConfigurationDetailRow label="Backend delivery queue">
                                {config.backendDeliveryQueue}
                            </ConfigurationDetailRow>
                        </ConfigurationBlock>

                        <ConfigurationBlock title="Gateway Queue" note="">
                            <ConfigurationDetailRow label="Gateway message submission queue">
                                {config.gatewaySubmissionQueue}
                            </ConfigurationDetailRow>

                            <ConfigurationDetailRow label="Gateway message submission reply queue">
                                {config.gatewaySubmissionReplyQueue}
                            </ConfigurationDetailRow>
                        </ConfigurationBlock>
                    </div>
                )
            }
        </>
    );
}

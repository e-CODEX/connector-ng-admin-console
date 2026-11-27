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

import NextLink from "next/link";
import { Tooltip } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownToLine, ArrowUpFromLine, ArrowUpRight, Network, Wrench } from "lucide-react";
import type { QueueConfiguration } from "@/types/response/configuration";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationValue } from "@/components/configuration/configuration-value";

interface QueueGroup {
    title: string;
    description: string;
    icon: LucideIcon;
    queues: { label: string; key: keyof QueueConfiguration }[];
}

const GROUPS: QueueGroup[] = [
    {
        title: "Outbound",
        description: "Messages sent by the backends, on their way to the gateway.",
        icon: ArrowUpFromLine,
        queues: [
            { label: "Message staging", key: "outboundMessageStagingQueue" },
            { label: "Message processing", key: "outboundMessageProcessingQueue" },
            { label: "Evidence trigger", key: "outboundEvidenceTriggerQueue" },
        ],
    },
    {
        title: "Inbound",
        description: "Messages received from the gateway, on their way to the backends.",
        icon: ArrowDownToLine,
        queues: [
            { label: "Message staging", key: "inboundMessageStagingQueue" },
            { label: "Message processing", key: "inboundMessageProcessingQueue" },
            { label: "Evidence trigger", key: "inboundEvidenceTriggerQueue" },
            { label: "Backend delivery", key: "backendDeliveryQueue" },
        ],
    },
    {
        title: "Gateway",
        description: "Exchanges with the AS4 gateway.",
        icon: Network,
        queues: [
            { label: "Message submission", key: "gatewaySubmissionQueue" },
            { label: "Message submission reply", key: "gatewaySubmissionReplyQueue" },
            { label: "Message reception", key: "gatewayReceptionQueue" },
        ],
    },
    {
        title: "Maintenance",
        description: "Housekeeping of the messages that are done.",
        icon: Wrench,
        queues: [{ label: "Resolved messages clean-up", key: "resolvedMessageCleanupProcessingQueue" }],
    },
];

function QueueValue({ name }: { name: string | undefined }) {
    if (!name) return <ConfigurationValue value={name} />;

    return (
        <span className="inline-flex max-w-full items-center gap-1">
            <ConfigurationValue value={name} mono copyable />
            <Tooltip delay={0}>
                <NextLink
                    href={`/admin/queues?queue=${encodeURIComponent(name)}`}
                    aria-label={`Open the ${name} queue`}
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
                >
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </NextLink>
                <Tooltip.Content>Open in JMS queues</Tooltip.Content>
            </Tooltip>
        </span>
    );
}

export function ConfigurationJmsQueueSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("jms-queues", configurationService.getQueueConfiguration);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the JMS queues configuration">
            {(config) => (
                <div className="grid gap-4 xl:grid-cols-2">
                    {GROUPS.map((group) => (
                        <ConfigurationBlock key={group.title} icon={group.icon} title={group.title} description={group.description}>
                            <ConfigurationDetailList>
                                {group.queues.map((queue) => (
                                    <ConfigurationDetailRow key={queue.key} label={queue.label}>
                                        <QueueValue name={config[queue.key]} />
                                    </ConfigurationDetailRow>
                                ))}
                            </ConfigurationDetailList>
                        </ConfigurationBlock>
                    ))}
                </div>
            )}
        </ConfigurationSection>
    );
}

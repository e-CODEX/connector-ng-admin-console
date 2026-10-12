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

import React, { useState } from "react";
import { ConnectorQueueStats } from "@/types/response/queue";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { ArrowsRotateRight } from "@gravity-ui/icons";
import { PageHeader } from "@/components/common/header/page-header";
import { QueueCard } from "@/components/queue/QueueCard";
import { Layers } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useList } from "@/hooks/use-list";
import { useQueueService } from "@/hooks/use-http-service";

export default function QueueAdminPage() {
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null)

    const queueService = useQueueService();

    const list = useList<ConnectorQueueStats>(queueService.loadQueueStats);

    return (
        <div>
            <PageHeader
                icon={Layers}
                title="JMS Queues Statuses"
                subtitle="Manage JMS Queues"
            >

                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={ArrowsRotateRight}
                    onPress={list.refresh}
                    isDisabled={list.refreshing}
                    isSpinning={list.refreshing || list.loading}
                />
            </PageHeader>

            {list.loading ? (
                <SpinnerView className="mt-80"/>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-5 gap-y-2">
                    {list.items.map((queueStats) => (
                        <QueueCard
                            key={queueStats.queueName}
                            stats={queueStats}
                            selected={selectedQueue === queueStats.queueName}
                            onSelect={() => setSelectedQueue(queueStats.queueName)}
                        />
                    ))}
                </div>
            )}

            {list.items.length === 0 && !list.refreshing && (
                <EmptyState text="No queue stats available" className="mt-70"/>
            )}
        </div>
    )
}

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
import type { ConnectorQueueStats } from "@/types/response/queue";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { PageHeader } from "@/components/common/header/page-header";
import { QueueCard } from "@/components/queue/QueueCard";
import { Layers, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useList } from "@/hooks/use-list";
import { useQueueService } from "@/hooks/use-http-service";
import { LoadErrorState } from "@/components/common/load-error-state";

export default function QueueAdminPage() {
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null);

    const queueService = useQueueService();

    const list = useList<ConnectorQueueStats>(queueService.loadQueueStats);

    // Nothing to show yet: first load, or a refresh of an empty list.
    const showSpinner = list.loading || (list.refreshing && list.items.length === 0);

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
                    icon={RefreshCw}
                    onPress={list.refresh}
                    isDisabled={list.refreshing}
                    isSpinning={list.refreshing || list.loading}
                />
            </PageHeader>

            {showSpinner ? (
                <SpinnerView className="mt-60"/>
            ) : list.loadError ? (
                <LoadErrorState
                    title="Could not load JMS queues statuses"
                    onRetry={list.retry}
                />
            ) : list.items.length === 0 ? (
                <EmptyState text="No queue stats available" className="mt-70"/>
            ) : (
                <div
                    aria-busy={list.refreshing}
                    className={`grid grid-cols-1 gap-x-5 gap-y-2 transition-opacity sm:grid-cols-4 ${
                        list.refreshing ? "pointer-events-none opacity-50" : ""
                    }`}
                >
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
        </div>
    );
}

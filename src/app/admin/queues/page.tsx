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

import React, { useMemo, useState } from "react";
import type { ConnectorQueueStats } from "@/types/response/queue";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { PageHeader } from "@/components/common/header/page-header";
import { Layers, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useList } from "@/hooks/use-list";
import { useQueueService } from "@/hooks/use-http-service";
import { LoadErrorState } from "@/components/common/load-error-state";
import { QueueMessagesView } from "@/components/queue/queue-messages-view";
import { groupByCategory, QueueList } from "@/components/queue/queue-list";

export default function QueueAdminPage() {
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null);

    const queueService = useQueueService();

    const list = useList<ConnectorQueueStats>(queueService.loadQueueStats);

    const groups = useMemo(() => groupByCategory(list.items), [list.items]);

    const orderedQueues = groups.flatMap((group) => group.queues);
    const selectedStats = orderedQueues.find((queue) => queue.queueName === selectedQueue) ?? orderedQueues.find((queue) => queue.dlqCount > 0) ?? orderedQueues[0];

    // Only when nothing is shown yet: a reload (header refresh, or after a replay) must keep the
    // open messages panel mounted, with its tab, page and selection.
    const showSpinner = (list.loading || list.refreshing) && list.items.length === 0;

    return (
        <div>
            <PageHeader icon={Layers} title="JMS queues" subtitle="Pending and dead-letter messages per queue">
                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh queues"
                    icon={RefreshCw}
                    onPress={list.refresh}
                    isDisabled={list.refreshing}
                    isSpinning={list.refreshing || list.loading}
                />
            </PageHeader>

            {showSpinner ? (
                <SpinnerView className="mt-60" />
            ) : list.loadError ? (
                <LoadErrorState title="Could not load JMS queues statuses" onRetry={list.retry} />
            ) : list.items.length === 0 || !selectedStats ? (
                <EmptyState text="No queue stats available" className="mt-70" />
            ) : (
                <div className="grid gap-4 lg:grid-cols-[28rem_minmax(0,1fr)]">
                    {/* Both columns stretch to the taller one, so the list and the messages panel always end level. */}
                    <div aria-busy={list.refreshing} className={`h-full transition-opacity ${list.refreshing ? "pointer-events-none opacity-50" : ""}`}>
                        <QueueList groups={groups} selectedQueue={selectedStats.queueName} onSelect={setSelectedQueue} />
                    </div>

                    <QueueMessagesView key={selectedStats.queueName} queue={selectedStats} onDlqChanged={list.refresh} />
                </div>
            )}
        </div>
    );
}

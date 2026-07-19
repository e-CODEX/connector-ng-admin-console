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

import React, { useEffect, useRef, useState } from "react";
import { ConnectorQueueStatsResponse } from "@/types/response/queue";
import { toastError } from "@/utils";
import { loadQueueStats } from "@/services/queue";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { ArrowsRotateRight } from "@gravity-ui/icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@heroui/react";
import { QueueCard } from "@/components/queue/QueueCard";
import { Layers } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";

export default function QueueAdminPage() {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [queues, setQueues] = useState<ConnectorQueueStatsResponse[]>([])
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null)
    const requestId = useRef(0);

    const onRefreshClick = async () => {
        setRefreshing(true)
        try {
            await loadQueues();
        } finally {
            setRefreshing(false);
        }
    }

    const loadQueues = async () => {
        const id = ++requestId.current;
        setLoading(true)
        try {
            const data = await loadQueueStats()

            if (id !== requestId.current) {
                return;
            }

            setQueues(data || [])
        } catch (error) {
            if (id !== requestId.current) {
                return;
            }

            toastError(error)
        } finally {
            if (id === requestId.current) {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        void loadQueues()
    }, [])


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
                    onPress={onRefreshClick}
                    isDisabled={refreshing}
                    isSpinning={refreshing || loading}
                />
            </PageHeader>

            {loading ? (
                <SpinnerView className="mt-80"/>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-5 gap-y-2">
                    {queues.map((queueStats) => (
                        <QueueCard
                            key={queueStats.queueName}
                            stats={queueStats}
                            selected={selectedQueue === queueStats.queueName}
                            onSelect={() => setSelectedQueue(queueStats.queueName)}
                        />
                    ))}
                </div>
            )}

            {!loading && !refreshing && queues && queues.length === 0 && (
                <EmptyState text="No queue stats available" className="mt-70"/>
            )}
        </div>
    )
}

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

import React, { useRef, useState } from "react";
import type { Key } from "react-aria-components";
import { Tabs } from "@heroui/react";
import { RefreshCw } from "lucide-react";
import type { ConnectorQueueStats } from "@/types/response/queue";
import type { PagedListParams } from "@/hooks/use-paged-list";
import { useQueueService } from "@/hooks/use-http-service";
import { QueueMessagesTable, type QueueMessagesTableHandle } from "@/components/queue/queue-messages-table";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { formatCount } from "@/utils";

const MESSAGES_TAB = "messages";
const DLQ_TAB = "dlq";

interface QueueMessagesViewProps {
    queue: ConnectorQueueStats;
}

export function QueueMessagesView({ queue }: QueueMessagesViewProps) {
    const queueService = useQueueService();
    const { queueName, queueDescription, pendingCount, dlqCount } = queue;

    const [selectedTab, setSelectedTab] = useState<Key>(dlqCount > 0 ? DLQ_TAB : MESSAGES_TAB);
    const tableRef = useRef<QueueMessagesTableHandle>(null);
    const [busy, setBusy] = useState(true);

    const loadMessages = ({ page, size }: PagedListParams) => queueService.listQueueMessages({ page, size, queue: queueName, dlq: false });
    const loadDlqMessages = ({ page, size }: PagedListParams) => queueService.listQueueDlqMessages({ page, size, queue: queueName, dlq: true });

    return (
        <section aria-labelledby="queue-messages-title" className="mt-8">
            <div className="mb-3 min-w-0">
                <h2 id="queue-messages-title" className="truncate text-lg font-semibold">
                    {queueDescription}
                </h2>
                <p className="font-mono text-sm text-muted">{queueName}</p>
            </div>

            <Tabs className="w-full" selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
                <div className="flex items-center gap-3">
                    <Tabs.ListContainer className="min-w-0 flex-1">
                        <Tabs.List aria-label={`${queueDescription} messages`}>
                            <Tabs.Tab id={MESSAGES_TAB}>
                                Pending ({formatCount(pendingCount)})
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id={DLQ_TAB}>
                                Dead letters ({formatCount(dlqCount)})
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                    <PageHeaderButton variant="secondary" tooltip="Refresh" icon={RefreshCw} onPress={() => tableRef.current?.refresh()} isDisabled={busy} isSpinning={busy} />
                </div>

                <Tabs.Panel className="pt-4" id={MESSAGES_TAB}>
                    <QueueMessagesTable
                        ref={tableRef}
                        onBusyChange={setBusy}
                        load={loadMessages}
                        ariaLabel={`Messages of ${queueDescription}`}
                        emptyText="No pending message"
                        errorTitle="Could not load queue messages"
                    />
                </Tabs.Panel>
                <Tabs.Panel className="pt-4" id={DLQ_TAB}>
                    <QueueMessagesTable
                        ref={tableRef}
                        onBusyChange={setBusy}
                        load={loadDlqMessages}
                        ariaLabel={`Dead letter messages of ${queueDescription}`}
                        emptyText="No dead letter message"
                        errorTitle="Could not load dead letter messages"
                        showFailureCause
                    />
                </Tabs.Panel>
            </Tabs>
        </section>
    );
}

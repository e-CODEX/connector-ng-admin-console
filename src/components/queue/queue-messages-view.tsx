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
import type { ConnectorQueueReplayResult, ConnectorQueueStats } from "@/types/response/queue";
import type { PagedListParams } from "@/hooks/use-paged-list";
import { useQueueService } from "@/hooks/use-http-service";
import { QueueMessagesTable, type QueueMessagesReplay, type QueueMessagesTableHandle, type QueueReplayOutcome } from "@/components/queue/queue-messages-table";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { formatCount } from "@/utils";

const MESSAGES_TAB = "messages";
const DLQ_TAB = "dlq";

interface QueueMessagesViewProps {
    queue: ConnectorQueueStats;
    onDlqChanged?: () => void;
}

export function QueueMessagesView({ queue, onDlqChanged }: QueueMessagesViewProps) {
    const queueService = useQueueService();
    const { queueName, queueDescription, pendingCount, dlqCount } = queue;

    const [selectedTab, setSelectedTab] = useState<Key>(dlqCount > 0 ? DLQ_TAB : MESSAGES_TAB);
    const tableRef = useRef<QueueMessagesTableHandle>(null);
    const [busy, setBusy] = useState(true);

    const loadMessages = ({ page, size }: PagedListParams) => queueService.listQueueMessages({ page, size, queue: queueName, dlq: false });
    const loadDlqMessages = ({ page, size }: PagedListParams) => queueService.listQueueDlqMessages({ page, size, queue: queueName, dlq: true });

    const replay: QueueMessagesReplay = {
        targetLabel: queueDescription,
        replayMessage: async (messageId) => {
            await queueService.replayDlqMessage(messageId, { messageId, queue: queueName });
            onDlqChanged?.();
        },
        replayMessages: async (messageIds) => {
            const response: ConnectorQueueReplayResult | ConnectorQueueReplayResult[] | undefined = await queueService.replayDlqMessages({
                messageIds,
                queue: queueName,
            });
            // Accept one result or a list of them. No body at all (204): the call succeeded, so count all as replayed.
            const results = response == null ? [{ replayed: messageIds, notFound: [], failed: [] }] : Array.isArray(response) ? response : [response];
            const outcome: QueueReplayOutcome = {
                replayed: results.flatMap((result) => result.replayed ?? []),
                notFound: results.flatMap((result) => result.notFound ?? []),
                failed: results.flatMap((result) => result.failed ?? []),
            };
            // The dead-letter count changed only if something actually left the queue.
            if (outcome.replayed.length > 0 || outcome.notFound.length > 0) {
                onDlqChanged?.();
            }
            return outcome;
        },
    };

    return (
        <section aria-labelledby="queue-messages-title" className="min-w-0 rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-3">
                <div className="flex min-w-0 flex-1 items-baseline gap-2">
                    <h2 id="queue-messages-title" className="truncate text-base font-semibold" title={queueDescription}>
                        {queueDescription}
                    </h2>
                    <span className="truncate font-mono text-xs text-muted" title={queueName}>
                        {queueName}
                    </span>
                </div>
                <PageHeaderButton variant="secondary" tooltip="Refresh" icon={RefreshCw} onPress={() => tableRef.current?.refresh()} isDisabled={busy} isSpinning={busy} />
            </div>

            <Tabs className="w-full" selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
                <Tabs.ListContainer className="w-fit">
                    <Tabs.List aria-label={`${queueDescription} messages`}>
                        <Tabs.Tab id={DLQ_TAB} className="whitespace-nowrap">
                            Dead letters ({formatCount(dlqCount)})
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id={MESSAGES_TAB} className="whitespace-nowrap">
                            Pending ({formatCount(pendingCount)})
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel className="pt-4" id={DLQ_TAB}>
                    <QueueMessagesTable
                        ref={tableRef}
                        onBusyChange={setBusy}
                        load={loadDlqMessages}
                        ariaLabel={`Dead letter messages of ${queueDescription}`}
                        emptyText="No dead letter message"
                        errorTitle="Could not load dead letter messages"
                        showFailureCause
                        replay={replay}
                        onDeleteMessage={async (messageId) => {
                            await queueService.deleteDlqQueueMessage(messageId, queueName);
                            onDlqChanged?.();
                        }}
                    />
                </Tabs.Panel>
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
            </Tabs>
        </section>
    );
}

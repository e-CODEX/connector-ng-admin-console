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

import React from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import type { CONNECTOR_QUEUE_STATS_CATEGORY, ConnectorQueueStats } from "@/types/response/queue";
import { formatCount } from "@/utils";

const CATEGORY_ORDER: CONNECTOR_QUEUE_STATS_CATEGORY[] = ["CONNECTOR", "GATEWAY"];

const CATEGORY_LABELS: Record<CONNECTOR_QUEUE_STATS_CATEGORY, string> = {
    CONNECTOR: "Connector",
    GATEWAY: "Gateway",
};

export interface QueueGroup {
    category: string;
    label: string;
    queues: ConnectorQueueStats[];
    dlqTotal: number;
}

export function groupByCategory(items: ConnectorQueueStats[]): QueueGroup[] {
    const byCategory = new Map<string, ConnectorQueueStats[]>();
    for (const item of items) {
        byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item]);
    }

    const rank = (category: string) => {
        const index = CATEGORY_ORDER.indexOf(category as CONNECTOR_QUEUE_STATS_CATEGORY);
        return index === -1 ? CATEGORY_ORDER.length : index;
    };

    return [...byCategory.entries()]
        .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
        .map(([category, queues]) => ({
            category,
            label: CATEGORY_LABELS[category as CONNECTOR_QUEUE_STATS_CATEGORY] ?? category,
            queues,
            dlqTotal: queues.reduce((total, queue) => total + queue.dlqCount, 0),
        }));
}

const plural = (count: number, word: string) => `${formatCount(count)} ${word}${count === 1 ? "" : "s"}`;

interface QueueListProps {
    groups: QueueGroup[];
    selectedQueue: string | null;
    onSelect: (queueName: string) => void;
}

export function QueueList({ groups, selectedQueue, onSelect }: QueueListProps) {
    return (
        <nav aria-label="JMS queues" className="h-full overflow-hidden rounded-xl border border-border bg-surface">
            <div aria-hidden="true" className="flex justify-end gap-4 border-b border-border px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted">
                <span className="w-12 text-right">Dead</span>
                <span className="w-12 text-right">Pending</span>
            </div>

            {groups.map((group) => (
                <section key={group.category} aria-labelledby={`queue-group-${group.category}`}>
                    <div className="flex items-baseline gap-2 bg-surface-secondary px-3 py-1.5">
                        <h2 id={`queue-group-${group.category}`} className="text-xs font-semibold uppercase tracking-wider">
                            {group.label}
                        </h2>
                        <span className="text-xs text-muted">{plural(group.queues.length, "queue")}</span>
                        {group.dlqTotal > 0 && <span className="ml-auto text-xs font-medium text-danger">{plural(group.dlqTotal, "dead letter")}</span>}
                    </div>

                    <ul>
                        {group.queues.map((queue) => (
                            <li key={queue.queueName}>
                                <QueueListRow queue={queue} selected={queue.queueName === selectedQueue} onSelect={onSelect} />
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </nav>
    );
}

interface QueueListRowProps {
    queue: ConnectorQueueStats;
    selected: boolean;
    onSelect: (queueName: string) => void;
}

function QueueListRow({ queue, selected, onSelect }: QueueListRowProps) {
    const { queueName, queueDescription, pendingCount, dlqCount } = queue;
    const hasDlq = dlqCount > 0;
    const StatusIcon = hasDlq ? CircleAlert : CircleCheck;

    return (
        <button
            type="button"
            onClick={() => onSelect(queueName)}
            aria-current={selected ? "true" : undefined}
            aria-label={`${queueDescription}: ${plural(dlqCount, "dead letter")}, ${plural(pendingCount, "pending message")}`}
            className={`flex w-full cursor-pointer items-center gap-3 border-l-2 px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset ${
                hasDlq ? "border-l-danger" : "border-l-transparent"
            } ${selected ? "bg-accent-soft" : "hover:bg-surface-secondary"}`}
        >
            <StatusIcon aria-hidden="true" className={`size-4 shrink-0 ${hasDlq ? "text-danger" : "text-success"}`} />

            <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm ${selected ? "font-semibold" : "font-medium"}`} title={queueDescription}>
                    {queueDescription}
                </span>
                <span className="block truncate font-mono text-xs text-muted" title={queueName}>
                    {queueName}
                </span>
            </span>

            <span className={`w-12 text-right text-sm font-semibold tabular-nums ${hasDlq ? "text-danger" : "text-muted"}`}>{formatCount(dlqCount)}</span>
            <span className={`w-12 text-right text-sm tabular-nums ${pendingCount > 0 ? "" : "text-muted"}`}>{formatCount(pendingCount)}</span>
        </button>
    );
}

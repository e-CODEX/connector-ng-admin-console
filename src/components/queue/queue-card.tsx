/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ConnectorQueueStats } from "@/types/response/queue";
import { Card } from "@heroui/react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { formatCount } from "@/utils";

interface QueueCardProps {
    stats: ConnectorQueueStats;
    selected: boolean;
    onSelect: () => void;
}

const plural = (count: number, word: string) => `${formatCount(count)} ${word}${count === 1 ? "" : "s"}`;

export function QueueCard({ stats, selected, onSelect }: QueueCardProps) {
    const { queueName, queueDescription, pendingCount, dlqCount } = stats;
    const hasDlq = dlqCount > 0;
    const StatusIcon = hasDlq ? CircleAlert : CircleCheck;

    const tone = selected
        ? "border-accent bg-accent-soft shadow-sm"
        : hasDlq
          ? "border-danger/40 bg-danger-soft hover:border-danger/60"
          : "border-border hover:bg-surface-secondary";

    return (
        <Card className={`group overflow-hidden rounded-md border p-0 transition-colors duration-200 ${tone}`}>
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={selected}
                aria-label={`${queueDescription}: ${plural(pendingCount, "pending message")}, ${plural(dlqCount, "dead letter")}`}
                className="block w-full cursor-pointer p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset"
            >
                <Card.Header className="p-0">
                    <div className="flex min-w-0 items-center gap-2">
                        <StatusIcon aria-hidden="true" className={`size-4 shrink-0 ${hasDlq ? "text-danger" : "text-success"}`} />
                        <Card.Title className="truncate text-xs font-medium leading-none" title={queueDescription}>
                            {queueDescription}
                        </Card.Title>
                    </div>
                    <p className="mt-1 truncate font-mono text-xs text-muted" title={queueName}>
                        {queueName}
                    </p>
                </Card.Header>

                <Card.Content className="p-0 pt-4">
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                        <div className="flex items-baseline gap-1.5">
                            <span className={`text-2xl font-semibold leading-none tabular-nums ${hasDlq ? "text-danger" : ""}`}>{formatCount(dlqCount)}</span>
                            <span className="text-xs font-medium uppercase tracking-wider text-muted">Dead letters</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-semibold leading-none tabular-nums">{formatCount(pendingCount)}</span>
                            <span className="text-xs font-medium uppercase tracking-wider text-muted">Pending</span>
                        </div>
                    </div>
                </Card.Content>
            </button>
        </Card>
    );
}

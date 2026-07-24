/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorQueueStats } from "@/types/response/queue";
import { Card } from "@heroui/react";

interface QueueCardProps {
    stats: ConnectorQueueStats;
    selected: boolean;
    onSelect: () => void;
}

export function QueueCard({ stats, selected, onSelect }: QueueCardProps) {
    const hasDlq = stats.dlqCount > 0;

    return (
        <Card
            className={`group border p-0 overflow-hidden rounded-xl transition-all duration-200 ${
                selected
                    ? "border-blue-500 bg-blue-500/6 shadow-sm shadow-blue-500/10"
                    : "border-default-200 hover:border-default-300 hover:bg-default-50"
            }`}
        >
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={selected}
                className="block w-full cursor-pointer p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
                <Card.Header className="p-0">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <span
                                aria-hidden="true"
                                className={`size-2 shrink-0 rounded-full transition-colors ${
                                    hasDlq
                                        ? "bg-danger shadow-[0_0_0_3px] shadow-danger/20"
                                        : "bg-success"
                                }`}
                            />
                            <Card.Title className="truncate text-sm font-semibold leading-none">
                                {stats.queueDescription}
                            </Card.Title>
                        </div>
                    </div>
                </Card.Header>

                <Card.Content className="p-0 pt-4">
                    <div className="flex items-start gap-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase tracking-wider text-default-400">
                                Messages
                            </span>
                            <span className="text-2xl font-semibold leading-none tabular-nums">
                                {stats.pendingCount.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium uppercase tracking-wider text-default-400">
                                DLQ
                            </span>
                            <span
                                className={"text-2xl font-semibold leading-none tabular-nums text-danger"}
                            >
                                {stats.dlqCount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Card.Content>
            </button>
        </Card>
    );
}

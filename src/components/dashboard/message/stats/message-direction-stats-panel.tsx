/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ReactNode } from "react";
import { Card, Chip } from "@heroui/react";
import { CircleCheck } from "lucide-react";
import { DashboardMetricTile } from "@/components/dashboard/dashboard-metric-tile";
import { MessageStatsDeliveryRateBar } from "@/components/dashboard/message/stats/message-stats-delivery-rate-bar";
import type { ConnectorMessageStatsItem } from "@/types/response/stats";
import { deliveryRate } from "@/utils";

export interface MessageDirectionStatsPanelProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    stats: ConnectorMessageStatsItem;
}

export function MessageDirectionStatsPanel({ title, subtitle, icon, stats }: MessageDirectionStatsPanelProps) {
    return (
        <Card>
            <Card.Header className="flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-md bg-accent/20 text-accent">
                        {icon}
                    </span>
                    <div className="flex flex-col leading-tight">
                        <Card.Title className="text-base font-semibold">{title}</Card.Title>
                        <span className="text-xs opacity-60">{subtitle}</span>
                    </div>
                </div>
                <Chip color="success" variant="soft" size="md">
                    <CircleCheck className="size-3.5"/>
                    {deliveryRate(stats)}% delivered
                </Chip>
            </Card.Header>

            <Card.Content className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <DashboardMetricTile label="Total" value={stats?.total}/>
                    <DashboardMetricTile label="Delivered" value={stats?.delivered} tone="success"/>
                    <DashboardMetricTile label="Rejected" value={stats?.rejected} tone="danger"/>
                    <DashboardMetricTile label="Pending" value={stats?.pending} tone="warning"/>
                </div>
                <MessageStatsDeliveryRateBar stats={stats}/>
            </Card.Content>
        </Card>
    );
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ReactNode } from "react";
import { Card, Chip } from "@heroui/react";
import { CircleCheck } from "lucide-react";
import { MetricTile } from "@/components/dashboard/metric-tile";
import { DeliveryRateBar } from "@/components/dashboard/message/delivery-rate-bar";
import { ConnectorMessageStatsItem } from "@/types/stats";
import { deliveryRate } from "@/utils";

export interface DirectionStatsPanelProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    stats: ConnectorMessageStatsItem;
}

export function DirectionStatsPanel({ title, subtitle, icon, stats }: DirectionStatsPanelProps) {
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
                    <MetricTile label="Total" value={stats?.total}/>
                    <MetricTile label="Delivered" value={stats?.delivered} tone="success"/>
                    <MetricTile label="Rejected" value={stats?.rejected} tone="danger"/>
                    <MetricTile label="Pending" value={stats?.pending} tone="warning"/>
                </div>
                <DeliveryRateBar stats={stats}/>
            </Card.Content>
        </Card>
    );
}

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

import { ReactNode } from "react";
import { Card, Chip } from "@heroui/react";
import { Circle } from "@gravity-ui/icons";
import { capitalize } from "@/utils";
import { HealthStatus } from "@/types/global";

export interface HealthCardProps {
    title: string;
    icon?: ReactNode;
    status: HealthStatus;
    details?: Array<{ label: string; value: string }>;
}

const HEALTH_COLOR: Record<HealthStatus, "success" | "warning" | "danger" | "default"> = {
    UP: "success",
    DEGRADED: "warning",
    DOWN: "danger",
    UNKNOWN: "default",
};

export function HealthCard({ title, icon, status, details = [] }: HealthCardProps) {
    return (
        <Card>
            <Card.Header className="flex-row items-center justify-between">
                <Card.Title className="flex items-center gap-2 text-sm font-semibold">
                    {icon}
                    {title}
                </Card.Title>
                <Chip color={HEALTH_COLOR[status]} variant="soft" size="sm" className="font-bold px-2">
                    <Circle className="size-2 fill-current"/>
                    {status}
                </Chip>
            </Card.Header>

            {details.length > 0 && (
                <Card.Content className="flex flex-col gap-1 text-sm">
                    {details.map((d) => (
                        <div key={d.label} className="flex justify-between">
                            <span className="opacity-60">{capitalize(d.label)}</span>
                            <span>{d.value}</span>
                        </div>
                    ))}
                </Card.Content>
            )}
        </Card>
    );
}

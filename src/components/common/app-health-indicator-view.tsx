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

import { useEffect, useState } from "react";
import { getHealthInfo } from "@/services/actuator";
import { Chip } from "@heroui/react";
import { HealthStatus } from "@/types/global";

type ChipColor = "success" | "danger" | "warning" | "default";

interface AppHealthIndicatorProps {
    readonly pollIntervalMs?: number;
    readonly size?: "sm" | "md" | "lg";
}

const PRESENTATION: Record<HealthStatus, { label: string; color: ChipColor; dot: string }> = {
    UP: { label: "UP", color: "success", dot: "bg-success" },
    DOWN: { label: "Down", color: "danger", dot: "bg-danger" },
    DEGRADED: {
        label: "Out of service",
        color: "warning",
        dot: "bg-warning",
    },
    UNKNOWN: { label: "Unknown", color: "default", dot: "bg-default-400" },
};

export function AppHealthIndicatorView({ pollIntervalMs = 60_000, size = "sm", }: AppHealthIndicatorProps) {
    const [status, setStatus] = useState<HealthStatus>("UNKNOWN");
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const getHealthStatus = async () => {
            try {
                const body = await getHealthInfo();
                if (!cancelled) {
                    setStatus(body.status ?? "UNKNOWN");
                }
            } catch {
                if (!cancelled) {
                    setStatus("DOWN");
                }
            } finally {
                if (!cancelled) {
                    setIsInitialLoad(false);
                }
            }
        };

        void getHealthStatus();
        const id = setInterval(() => void getHealthStatus(), pollIntervalMs);

        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [pollIntervalMs]);

    const { label, dot, color } = PRESENTATION[status];

    return (
        <Chip
            color={color}
            variant="soft"
            size={size}
            className="font-semibold px-3"
            role="status"
            aria-live="polite"
            title={`Health: ${status}`}
        >
            <span
                aria-hidden="true"
                className={`size-2 rounded-full ${dot} ${
                    status === "UP" ? "animate-pulse" : ""
                }`}
            />
            <Chip.Label>
                <span className="sr-only">Application health: </span>
                {isInitialLoad ? "Checking…" : label}
            </Chip.Label>
        </Chip>
    );
}

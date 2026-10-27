/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client"

import { AppBuildInfo } from "@/types/response/actuator";
import { Chip } from "@heroui/react";
import { AppHealthIndicatorView } from "@/components/common/app/app-health-indicator-view";
import { useActuatorService } from "@/hooks/use-http-service";
import { useEffect, useState } from "react";

const SNAPSHOT_SUFFIX = "-SNAPSHOT";

type AppInfoVariant = "footer" | "statusbar";

interface AppInfoProps {
    readonly variant?: AppInfoVariant;
    readonly className?: string;
}

function splitVersion(version: string): { base: string; isSnapshot: boolean } {
    const isSnapshot = version.endsWith(SNAPSHOT_SUFFIX);
    return {
        base: isSnapshot ? version.slice(0, -SNAPSHOT_SUFFIX.length) : version,
        isSnapshot,
    };
}

function formatBuildTime(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
    }).format(date);
}

export function AppInfoView({ variant = "footer", className = "", }: AppInfoProps) {
    const [appBuildInfo, setAppBuildInfo] = useState<AppBuildInfo | undefined>(undefined);
    const actuatorService = useActuatorService();

    useEffect(() => {
        let cancelled = false;

        const getAppInfo = async () => {
            try {
                if (!cancelled) {
                    const resolved = await actuatorService.getAppInfo();
                    setAppBuildInfo(resolved.build);
                }
            } catch {
                if (!cancelled) {
                    setAppBuildInfo(undefined);
                }
            }
        }

        void getAppInfo();

        return () => {
            cancelled = true;
        }

    }, [actuatorService]);


    const size = variant === "statusbar" ? "sm" : "md";

    if (!appBuildInfo) {
        return (
            <Chip color="default" variant="soft" size={size} className={className}>
                version unavailable
            </Chip>
        );
    }

    const version = splitVersion(appBuildInfo.version);
    const buildTime = formatBuildTime(appBuildInfo.time);

    const versionChip = (
        <Chip
            color="default"
            variant="soft"
            size={size}
            title={`${appBuildInfo.name} · built ${buildTime} UTC`}
        >
            <Chip.Label className="font-mono">v{version.base}</Chip.Label>
        </Chip>
    );

    const snapshotChip = version.isSnapshot ? (
        <Chip
            color="warning"
            variant="soft"
            size={size}
            title="Non-release build — not intended for production"
        >
            SNAPSHOT
        </Chip>
    ) : null;

    if (variant === "statusbar") {
        return (
            <span className={`inline-flex items-center gap-1.5 ${className}`}>
                {versionChip}
                {snapshotChip}
            </span>
        );
    }

    return (
        <div className={`text-default-500 flex flex-wrap items-center gap-x-10 gap-y-1 text-xs ${className}`}>
            <span className="text-default-700 truncate text-sm font-semibold">e-CODEX Connector</span>
            {versionChip}
            {snapshotChip}
            <AppHealthIndicatorView pollIntervalMs={30_000}/>
            <time dateTime={appBuildInfo.time} title={appBuildInfo.time} className="font-semibold">
                Built {buildTime} UTC
            </time>
        </div>
    );
}

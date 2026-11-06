/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { usePolledFetch } from "@/hooks/pooled-fetch";
import { Spinner } from "@heroui/react";
import { HealthCard } from "@/components/dashboard/health/health-card";
import { Database, HardDrive, HeartPulse, MessagesSquare } from "lucide-react";
import { asNumber, formatBytes } from "@/utils";
import { useActuatorService } from "@/hooks/use-http-service";

interface BackendHealthSectionProps {
    refreshToken?: number;
    refreshInterval: number;
}

export function BackendHealthSection({ refreshToken, refreshInterval }: BackendHealthSectionProps) {
    const actuatorService = useActuatorService();

    const { data, loading, error } = usePolledFetch(() => actuatorService.getHealthInfo(), refreshInterval, [refreshToken]);

    if (!data) {
        return (
            <>
                {loading && (
                    <div className="flex items-center justify-center min-h-100">
                        <Spinner size="lg"/>
                    </div>
                )}
                {error && (
                    <p className="text-danger text-sm">
                        Couldn’t load backend status. Retrying…
                    </p>
                )}
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-5 gap-y-2">
            <HealthCard
                title="Liveness Status"
                icon={<HeartPulse className="size-4"/>}
                status={data.components["ping"].status}/>

            <HealthCard
                title="Database Status"
                icon={<Database className="size-4"/>}
                status={data.components["db"].status}
                details={[
                    { label: "Vendor", value: String(data.components["db"]?.details?.database ?? "—") },
                ]}/>

            <HealthCard
                title="Disk Space"
                icon={<HardDrive className="size-4"/>}
                status={data.components["diskSpace"].status}
                details={[
                    { label: "Total", value: String(formatBytes(asNumber(data.components["diskSpace"]?.details?.total)) ?? "—") },
                    { label: "Free", value: String(formatBytes(asNumber(data.components["diskSpace"]?.details?.free)) ?? "—") }
                ]}
            />

            <HealthCard
                title="JMS Broker Status"
                icon={<MessagesSquare className="size-4"/>}
                status={data.components["jms"].status}
                details={[
                    { label: "Provider", value: String(data.components["jms"]?.components?.["xaConnectionFactory"]?.details?.provider ?? "—") }
                ]}/>
        </div>
    )
}

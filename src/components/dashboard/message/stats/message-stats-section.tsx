/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { MessageDirectionStatsPanel } from "@/components/dashboard/message/stats/message-direction-stats-panel";
import { ArrowDownLeft, ArrowUpRight, MessagesSquare } from "lucide-react";
import { usePolledFetch } from "@/hooks/pooled-fetch";
import { getMessageStats } from "@/services/message";
import { Spinner } from "@heroui/react";
import { Period, periodToParams } from "@/types/period";

export function MessageStatsSection(
    { period, refreshToken }: { period: Period; refreshToken?: number; }) {
    const { data, loading, error } = usePolledFetch(() =>
        getMessageStats(periodToParams(period)), 45_000, [period, refreshToken]);

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
                        Couldn’t load message statistics. Retrying…
                    </p>
                )}
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
            <MessageDirectionStatsPanel
                title="All messages"
                subtitle="both directions"
                icon={<MessagesSquare className="size-17px"/>}
                stats={data.all}
            />
            <MessageDirectionStatsPanel
                title="Inbound"
                subtitle="gateway → backend"
                icon={<ArrowDownLeft className="size-17px"/>}
                stats={data?.inbound}
            />
            <MessageDirectionStatsPanel
                title="Outbound"
                subtitle="backend → gateway"
                icon={<ArrowUpRight className="size-17px"/>}
                stats={data?.outbound}
            />
        </div>
    );
}

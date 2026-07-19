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

import { Period, periodToParams } from "@/types/period";
import { usePolledFetch } from "@/hooks/pooled-fetch";
import { getMessageReports } from "@/services/message";
import { Spinner } from "@heroui/react";
import { MessageReportingStats } from "@/components/dashboard/message/reporting/message-reporting-stats";


interface MessageReportingSectionProps {
    period: Period;
    refreshToken?: number;
    refreshInterval: number;
}

export function MessageReportingSection({ period, refreshToken, refreshInterval }: MessageReportingSectionProps) {
    const { data, loading, error } = usePolledFetch(() =>
        getMessageReports(periodToParams(period)), refreshInterval, [period, refreshToken]);

    if (!data) {
        return (
            <div>
                {loading && (
                    <div className="flex items-center justify-center min-h-100">
                        <Spinner size="lg"/>
                    </div>
                )}
                {error && (
                    <p className="text-danger text-sm">
                        Couldn’t load message reporting. Retrying…
                    </p>
                )}
            </div>
        );
    }

    return <MessageReportingStats payload={data} refreshing={loading}/>;
}

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

import { PageHeader } from "@/components/common/page-hearder";
import { MessageStatsSection } from "@/components/dashboard/message/message-stats-section";
import { ArrowsRotateRight } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { useState } from "react";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { DEFAULT_PERIOD, Period } from "@/types/period";

export default function DashboardPage() {
    const [refreshToken, setRefreshToken] = useState(0);
    const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);

    const onRefreshClick = async () => {
        setRefreshToken((t) => t + 1)
    }

    return (
        <div className="flex flex-col gap-3">
            <PageHeader
                icon="clarity:dashboard-line"
                title="Dashboard"
                subtitle="App status and KPIs"
            >
                <PageHeaderButton
                    variant="secondary"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                />
                <PeriodFilter value={period} onChange={setPeriod} />
            </PageHeader>

            {/* Message KPIs */}
            <MessageStatsSection refreshToken={refreshToken} period={period}/>
        </div>
    );
}

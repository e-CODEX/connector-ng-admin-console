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

import { PageHeader } from "@/components/common/page-header";
import { MessageStatsSection } from "@/components/dashboard/message/stats/message-stats-section";
import { ArrowsRotateRight } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { useState } from "react";
import { PeriodFilterSelector } from "@/components/form/period-filter-selector";
import { DEFAULT_PERIOD, Period } from "@/types/period";
import { MessageReportingSection } from "@/components/dashboard/message/reporting/message-reporting-section";
import { DashboardSectionBox } from "@/components/dashboard/dashboard-section-box";
import { BackendHealthSection } from "@/components/dashboard/health/backend-health-section";
import { Gauge } from "lucide-react";

const REFRESH_INTERVAL = 60_000;

export default function DashboardPage() {
    const [refreshToken, setRefreshToken] = useState(0);
    const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);

    const onRefreshClick = async () => {
        setRefreshToken((t) => t + 1)
    }

    return (
        <div className="flex flex-col gap-3">
            <PageHeader
                icon={Gauge}
                title="Dashboard"
                subtitle="App status, KPIs and Reporting"
            >
                <PageHeaderButton
                    variant="secondary"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                />
                <PeriodFilterSelector value={period} onChange={setPeriod}/>
            </PageHeader>

            <DashboardSectionBox
                title="Connector Health"
                subtitle="Api, Db, JMS, Disk Space ..."
            >
                <BackendHealthSection refreshToken={refreshToken} refreshInterval={REFRESH_INTERVAL}/>
            </DashboardSectionBox>

            <DashboardSectionBox
                title="Overview"
                subtitle="Message volume and status at a glance"
            >
                <MessageStatsSection refreshToken={refreshToken} period={period} refreshInterval={REFRESH_INTERVAL}/>
            </DashboardSectionBox>

            <DashboardSectionBox
                title="Detailed Report"
                subtitle="Breakdown by party and service"
            >
                <MessageReportingSection refreshToken={refreshToken} period={period} refreshInterval={REFRESH_INTERVAL}/>
            </DashboardSectionBox>
        </div>
    );
}

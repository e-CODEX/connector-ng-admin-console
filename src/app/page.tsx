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
import { DashboardMessageReportingSection } from "@/components/dashboard/message/reporting/DashboardMessageReportingSection";
import { DashboardSectionBox } from "@/components/dashboard/DashboardSectionBox";

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
                subtitle="App status, KPIs and Reporting"
            >
                <PageHeaderButton
                    variant="secondary"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                />
                <PeriodFilter value={period} onChange={setPeriod}/>
            </PageHeader>

            <DashboardSectionBox
                title="Overview"
                subtitle="Message volume and status at a glance"
            >
                <MessageStatsSection refreshToken={refreshToken} period={period}/>
            </DashboardSectionBox>

            <DashboardSectionBox
                title="Detailed Report"
                subtitle="Breakdown by party and service"
            >
                <DashboardMessageReportingSection refreshToken={refreshToken} period={period}/>
            </DashboardSectionBox>
        </div>
    );
}

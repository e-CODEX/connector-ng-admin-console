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
import { asBusinessDomainSelectorFilter, BusinessDomainSelector } from "@/components/form/business-domain-selector";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";

const REFRESH_INTERVAL = 60_000;
const ALL_SELECTOR = "All Business domains";

export default function DashboardComponent() {
    const [refreshToken, setRefreshToken] = useState(0);
    const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
    const [businessDomainIdentifierQuery, setBusinessDomainIdentifierQuery] = useState<string>(ALL_SELECTOR);

    const businessDomainIdentifiers = useBusinessDomainIdentifiers(ALL_SELECTOR);

    const onRefreshClick = () => {
        setRefreshToken((t) => t + 1)
    }

    const onBusinessDomainIdentifierChange = (value: string) => {
        setBusinessDomainIdentifierQuery(value)
    }

    return (
        <div className="flex flex-col gap-3">
            <PageHeader
                icon={Gauge}
                title="Dashboard"
                subtitle="App status, KPIs and Reporting"
            >
                <PeriodFilterSelector value={period} onChange={setPeriod}/>

                <BusinessDomainSelector
                    label="Filter by business domain"
                    identifiers={businessDomainIdentifiers}
                    value={businessDomainIdentifierQuery}
                    onValueChange={onBusinessDomainIdentifierChange}
                    showLabel={false}
                />
                <PageHeaderButton
                    variant="secondary"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                />
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
                <MessageStatsSection
                    refreshToken={refreshToken}
                    period={period}
                    businessDomain={asBusinessDomainSelectorFilter(businessDomainIdentifierQuery, ALL_SELECTOR)}
                    refreshInterval={REFRESH_INTERVAL}/>
            </DashboardSectionBox>

            <DashboardSectionBox
                title="Detailed Report"
                subtitle="Breakdown by party and service"
            >
                <MessageReportingSection
                    refreshToken={refreshToken}
                    period={period}
                    businessDomain={asBusinessDomainSelectorFilter(businessDomainIdentifierQuery, ALL_SELECTOR)}
                    refreshInterval={REFRESH_INTERVAL}/>
            </DashboardSectionBox>
        </div>
    );
}

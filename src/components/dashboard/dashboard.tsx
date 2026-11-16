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

import { PageHeader } from "@/components/common/header/page-header";
import { MessageStatsSection } from "@/components/dashboard/message/stats/message-stats-section";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { useState } from "react";
import { PeriodFilterSelector } from "@/components/form/selector/period-filter-selector";
import type { Period } from "@/types/period";
import { DEFAULT_PERIOD } from "@/types/period";
import { MessageReportingSection } from "@/components/dashboard/message/reporting/message-reporting-section";
import { DashboardSectionBox } from "@/components/dashboard/dashboard-section-box";
import { BackendHealthSection } from "@/components/dashboard/health/backend-health-section";
import { Gauge, RefreshCw } from "lucide-react";
import { asBusinessDomainSelectorFilter, BusinessDomainSelector } from "@/components/form/selector/business-domain-selector";
import { useBusinessDomains } from "@/hooks/use-business-domain-identifiers";
import { LoadErrorState } from "@/components/common/load-error-state";

const REFRESH_INTERVAL = 60_000;
const ALL_SELECTOR = "All Business domains";

export default function DashboardComponent() {
    const [refreshToken, setRefreshToken] = useState(0);
    const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
    const [businessDomainIdentifierQuery, setBusinessDomainIdentifierQuery] = useState<string>(ALL_SELECTOR);

    const {
              identifiers: businessDomainIdentifiers,
              loadFailed: businessDomainsFailed,
              retry: retryBusinessDomains,
          } = useBusinessDomains(ALL_SELECTOR);

    const businessDomain = asBusinessDomainSelectorFilter(businessDomainIdentifierQuery, ALL_SELECTOR);

    const onRefreshClick = () => {
        setRefreshToken((t) => t + 1);
        if (businessDomainsFailed) retryBusinessDomains();
    };

    return (
        <div className="flex flex-col gap-3">
            <PageHeader icon={Gauge} title="Dashboard" subtitle="App status, KPIs and Reporting">
                <PeriodFilterSelector value={period} onChange={setPeriod}/>

                {!businessDomainsFailed && (
                    <BusinessDomainSelector
                        label="Filter by business domain"
                        identifiers={businessDomainIdentifiers}
                        value={businessDomainIdentifierQuery}
                        onValueChange={setBusinessDomainIdentifierQuery}
                        showLabel={false}
                    />
                )}

                <PageHeaderButton
                    variant="secondary"
                    icon={RefreshCw}
                    onPress={onRefreshClick}
                />
            </PageHeader>

            {businessDomainsFailed ? (
                <LoadErrorState
                    className="min-h-80"
                    title="Could not load statistics"
                    onRetry={retryBusinessDomains}
                />
            ) : (
                <>
                    <DashboardSectionBox title="Connector Health" subtitle="Api, Db, JMS, Disk Space ...">
                        <BackendHealthSection refreshToken={refreshToken} refreshInterval={REFRESH_INTERVAL}/>
                    </DashboardSectionBox>

                    <DashboardSectionBox title="Overview" subtitle="Message volume and status at a glance">
                        <MessageStatsSection
                            refreshToken={refreshToken}
                            period={period}
                            businessDomain={businessDomain}
                            refreshInterval={REFRESH_INTERVAL}/>
                    </DashboardSectionBox>

                    <DashboardSectionBox title="Detailed Report" subtitle="Breakdown by party and service">
                        <MessageReportingSection
                            refreshToken={refreshToken}
                            period={period}
                            businessDomain={businessDomain}
                            refreshInterval={REFRESH_INTERVAL}/>
                    </DashboardSectionBox>
                </>
            )}
        </div>
    );
}

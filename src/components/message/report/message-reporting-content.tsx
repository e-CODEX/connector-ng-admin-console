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

import type { Key } from "@heroui/react";
import { Button, Description, Dropdown, Label, Modal, Table } from "@heroui/react";
import { type RangeValue } from "react-aria-components";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { MessageReportExportFormat } from "@/services/message";
import type { ZonedDateTime } from "@internationalized/date";
import { saveFile, toastError } from "@/utils";
import type { ConnectorMessageReportResponse } from "@/types/response/reporting";
import type { DateTimeRangeGranularity } from "@/components/form/selector/date-time-range-selector";
import { DateTimeRangeSelector } from "@/components/form/selector/date-time-range-selector";
import { EmptyState } from "@/components/common/empty-state";
import { SearchCriteriaBox } from "@/components/form/search-criteria-box";
import { SpinnerView } from "@/components/common/spinner-view";
import { asBusinessDomainSelectorFilter, BusinessDomainSelector } from "@/components/form/selector/business-domain-selector";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";
import { useMessageService } from "@/hooks/use-http-service";
import { buildDefaultRange, isDefaultRange, toDateRange } from "@/types/period";
import { LoadErrorState } from "@/components/common/load-error-state";
import { Search, Upload } from "lucide-react";

const ALL_BUSINESS_DOMAIN_SELECTOR = "All Business domains";

const granularity: DateTimeRangeGranularity = "minute";

type AppliedCriteria = {
    dateRange: RangeValue<ZonedDateTime> | null;
    domain: string;
};

const isDefaultCriteria = (dateRange: RangeValue<ZonedDateTime> | null, domain: string) => isDefaultRange(dateRange) && domain === ALL_BUSINESS_DOMAIN_SELECTOR;

function toExportFormat(formatKey: Key): MessageReportExportFormat {
    switch (formatKey) {
        case "export-csv":
            return "CSV";
        case "export-json":
            return "JSON";
        case "export-excel":
            return "XLSX";
        default:
            return "XLSX";
    }
}

export function MessageReportingContent() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const [messageReports, setMessageReports] = useState<ConnectorMessageReportResponse | undefined>(undefined);
    const [businessDomainIdentifierQuery, setBusinessDomainIdentifierQuery] = useState<string>(ALL_BUSINESS_DOMAIN_SELECTOR);
    const [dateRange, setDateRange] = useState<RangeValue<ZonedDateTime> | null>(buildDefaultRange);
    // The criteria the report currently on screen was loaded with (what Export must use).
    const [applied, setApplied] = useState<AppliedCriteria | null>(null);
    const requestId = useRef(0);

    const messageService = useMessageService();

    const businessDomainIdentifiers = useBusinessDomainIdentifiers(ALL_BUSINESS_DOMAIN_SELECTOR);

    const loadReports = useCallback(
        (selected: RangeValue<ZonedDateTime> | null, domain: string) => {
            const id = ++requestId.current;
            const isCurrent = () => id === requestId.current;

            return (async () => {
                setLoadFailed(false);
                try {
                    const data = await messageService.getMessageReports({
                        businessDomain: asBusinessDomainSelectorFilter(domain, ALL_BUSINESS_DOMAIN_SELECTOR),
                        ...toDateRange(selected, granularity),
                    });
                    if (!isCurrent()) return;
                    setMessageReports(data);
                    setApplied({ dateRange: selected, domain });
                } catch {
                    if (isCurrent()) {
                        setMessageReports(undefined);
                        setLoadFailed(true);
                    }
                } finally {
                    if (isCurrent()) {
                        setLoading(false);
                        setRefreshing(false);
                    }
                }
            })();
        },
        [messageService],
    );

    useEffect(() => {
        const idRef = requestId;
        void loadReports(dateRange, businessDomainIdentifierQuery);
        return () => {
            idRef.current++;
        };
        // Initial load only: later loads are triggered by Search / Retry.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadReports]);

    const retry = () => {
        setLoading(true);
        void loadReports(dateRange, businessDomainIdentifierQuery);
    };

    const onApplyPress = () => {
        setRefreshing(true);
        void loadReports(dateRange, businessDomainIdentifierQuery);
    };

    const onClearPress = () => {
        const defaultRange = buildDefaultRange();
        setDateRange(defaultRange);
        setBusinessDomainIdentifierQuery(ALL_BUSINESS_DOMAIN_SELECTOR);
        setRefreshing(true);
        void loadReports(defaultRange, ALL_BUSINESS_DOMAIN_SELECTOR);
    };

    const onExportClick = async (formatKey: Key) => {
        if (!applied || exporting) {
            return;
        }

        setExporting(true);
        try {
            const params = {
                ...toDateRange(applied.dateRange, granularity),
                format: toExportFormat(formatKey),
                businessDomain: asBusinessDomainSelectorFilter(applied.domain, ALL_BUSINESS_DOMAIN_SELECTOR),
            };
            const file = await messageService.exportMessageReports(params);
            saveFile(file);
        } catch (error) {
            toastError(error);
        } finally {
            setExporting(false);
        }
    };

    const years = messageReports?.years ?? [];
    const hasReports = years.length > 0;
    const idle = !loading && !refreshing;

    // The selectors changed since the report on screen was loaded.
    const dirty = !!applied && (applied.dateRange !== dateRange || applied.domain !== businessDomainIdentifierQuery);

    const canClear = idle && (!isDefaultCriteria(dateRange, businessDomainIdentifierQuery) || (!!applied && !isDefaultCriteria(applied.dateRange, applied.domain)));

    return (
        <>
            <Modal.Body className="flex flex-1 flex-col">
                <SearchCriteriaBox className="mt-0" onClear={onClearPress} canClear={canClear}>
                    <DateTimeRangeSelector
                        label="Select a date range"
                        value={dateRange}
                        granularity={granularity}
                        shouldForceLeadingZeros={true}
                        onChange={(next) => setDateRange(next as RangeValue<ZonedDateTime> | null)}
                    />
                    <BusinessDomainSelector identifiers={businessDomainIdentifiers} value={businessDomainIdentifierQuery} onValueChange={setBusinessDomainIdentifierQuery} />

                    <div className="flex flex-col">
                        <span className="mb-1 text-sm font-medium invisible" aria-hidden="true">
                            Search
                        </span>
                        <Button variant="primary" isPending={refreshing} isDisabled={!dateRange} onPress={onApplyPress}>
                            <Search />
                            Search
                        </Button>
                    </div>
                </SearchCriteriaBox>

                {(loading || refreshing) && !messageReports && <SpinnerView className="mt-60" />}

                {idle && loadFailed && <LoadErrorState className="min-h-80 flex-1" title="Could not load message reports" onRetry={retry} />}

                {idle && !loadFailed && messageReports !== undefined && !hasReports && <EmptyState text="No report available" className="flex-1" />}

                {dirty && hasReports && <p className="mt-2 text-xs text-muted">Filters changed. Press Search to update the report.</p>}

                {hasReports && (
                    <div aria-busy={refreshing} className={`flex flex-col transition-opacity ${refreshing ? "pointer-events-none opacity-50" : ""}`}>
                        {years.map((content) => (
                            <div key={content.year} className="flex flex-col gap-y-2">
                                <div className="my-2 flex items-center gap-3">
                                    <h2 className="text-lg font-semibold tracking-tight text-foreground">{content.year}</h2>
                                    <span className="h-px flex-1 bg-default-200" />
                                    <span className="text-xs font-medium text-muted">
                                        {content.months.length} month{content.months.length === 1 ? "" : "s"}
                                    </span>
                                </div>
                                <Table>
                                    <Table.ScrollContainer>
                                        <Table.Content aria-label={`Message reports for year ${content.year}`}>
                                            <Table.Header>
                                                <Table.Column isRowHeader>Party</Table.Column>
                                                <Table.Column>Service</Table.Column>
                                                <Table.Column>Inbound</Table.Column>
                                                <Table.Column>Outbound</Table.Column>
                                                <Table.Column>Total</Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                {content.months.map((month) => (
                                                    <Fragment key={`${content.year}-${month.label}`}>
                                                        {/* group header spanning all columns */}
                                                        <Table.Row>
                                                            <Table.Cell colSpan={5} className="bg-slate-400 text-center font-semibold">
                                                                {month.label}
                                                            </Table.Cell>
                                                        </Table.Row>

                                                        {/* normal data rows for that month */}
                                                        {month.reports.map((report) => (
                                                            <Table.Row key={`${report.party}|${report.service}`}>
                                                                <Table.Cell>{report.party}</Table.Cell>
                                                                <Table.Cell>{report.service}</Table.Cell>
                                                                <Table.Cell>{report.inbound}</Table.Cell>
                                                                <Table.Cell>{report.outbound}</Table.Cell>
                                                                <Table.Cell>{report.total}</Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                        <Table.Row>
                                                            <Table.Cell colSpan={2} className="bg-warning-soft font-semibold">
                                                                Total
                                                            </Table.Cell>
                                                            <Table.Cell className="bg-warning-soft font-semibold">{month.totalInbound}</Table.Cell>
                                                            <Table.Cell className="bg-warning-soft font-semibold">{month.totalOutbound}</Table.Cell>
                                                            <Table.Cell className="bg-warning-soft font-semibold">{month.total}</Table.Cell>
                                                        </Table.Row>
                                                    </Fragment>
                                                ))}
                                            </Table.Body>
                                        </Table.Content>
                                    </Table.ScrollContainer>
                                </Table>
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Dropdown>
                    <Button variant="secondary" aria-label="Export report menu" isPending={exporting} isDisabled={!hasReports || loading || refreshing || exporting}>
                        <Upload />
                        Export
                    </Button>
                    <Dropdown.Popover>
                        <Dropdown.Menu onAction={onExportClick}>
                            <Dropdown.Item id="export-excel" textValue="Excel">
                                <div className="flex h-8 items-start justify-center pt-px">
                                    <Upload className="size-4 shrink-0 text-muted" />
                                </div>
                                <div className="flex flex-col">
                                    <Label>Excel</Label>
                                    <Description>Export to Excel</Description>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item id="export-json" textValue="JSON">
                                <div className="flex h-8 items-start justify-center pt-px">
                                    <Upload className="size-4 shrink-0 text-muted" />
                                </div>
                                <div className="flex flex-col">
                                    <Label>JSON</Label>
                                    <Description>Export to JSON format</Description>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item id="export-csv" textValue="CSV">
                                <div className="flex h-8 items-start justify-center pt-px">
                                    <Upload className="size-4 shrink-0 text-muted" />
                                </div>
                                <div className="flex flex-col">
                                    <Label>CSV</Label>
                                    <Description>Export to CSV</Description>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </Modal.Footer>
        </>
    );
}

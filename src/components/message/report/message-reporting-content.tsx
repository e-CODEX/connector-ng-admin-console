/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Button, Description, Dropdown, Kbd, Key, Label, Modal, Table } from "@heroui/react";
import { type RangeValue } from "react-aria-components";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { MessageReportExportFormat } from "@/services/message";
import { ZonedDateTime } from "@internationalized/date";
import { saveFile, toastError } from "@/utils";
import { ArrowUpFromSquare, Magnifier } from "@gravity-ui/icons";
import { ConnectorMessageReportResponse } from "@/types/response/reporting";
import { DateTimeRangeGranularity, DateTimeRangeSelector } from "@/components/form/date-time-range-selector";
import { EmptyState } from "@/components/common/empty-state";
import { SearchCriteriaBox } from "@/components/form/search-criteria-box";
import { SpinnerView } from "@/components/common/spinner-view";
import { asBusinessDomainSelectorFilter, BusinessDomainSelector } from "@/components/form/business-domain-selector";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";
import { useMessageService } from "@/hooks/use-http-service";
import { buildDefaultRange, toDateRange } from "@/types/period";

const ALL_BUSINESS_DOMAIN_SELECTOR = "All Business domains";

const granularity: DateTimeRangeGranularity = "day";

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
    const [messageReports, setMessageReports] = useState<ConnectorMessageReportResponse | undefined>(undefined);
    const [businessDomainIdentifierQuery, setBusinessDomainIdentifierQuery] = useState<string>(ALL_BUSINESS_DOMAIN_SELECTOR);
    const [dateRange, setDateRange] = useState<RangeValue<ZonedDateTime> | null>(buildDefaultRange);
    const [hasLoaded, setHasLoaded] = useState(false);
    const requestId = useRef(0);

    const messageService = useMessageService();

    const businessDomainIdentifiers = useBusinessDomainIdentifiers(ALL_BUSINESS_DOMAIN_SELECTOR);

    const loadReports = useCallback(
        (selected: RangeValue<ZonedDateTime> | null, domain: string) => {
            const id = ++requestId.current;
            const isCurrent = () => id === requestId.current;

            return (async () => {
                try {
                    const data = await messageService.getMessageReports({
                        businessDomain: asBusinessDomainSelectorFilter(domain, ALL_BUSINESS_DOMAIN_SELECTOR),
                        ...toDateRange(selected, granularity),
                    });
                    if (!isCurrent()) return;
                    setMessageReports(data);
                    setHasLoaded(true);
                } catch (error) {
                    if (isCurrent()) toastError(error);
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
        void loadReports(buildDefaultRange(), ALL_BUSINESS_DOMAIN_SELECTOR);
        return () => {
            idRef.current++;
        };
    }, [loadReports]);

    const onBusinessDomainIdentifierChange = (value: string) => {
        setBusinessDomainIdentifierQuery(value);
        setMessageReports(undefined);
    };

    const onApplyPress = () => {
        setRefreshing(true);
        void loadReports(dateRange, businessDomainIdentifierQuery);
    };

    const onExportClick = async (formatKey: Key) => {
        const params = {
            ...toDateRange(dateRange, granularity),
            format: toExportFormat(formatKey),
            businessDomain: asBusinessDomainSelectorFilter(businessDomainIdentifierQuery, ALL_BUSINESS_DOMAIN_SELECTOR),
        };

        try {
            const file = await messageService.exportMessageReports(params);
            saveFile(file);
        } catch (error) {
            toastError(error);
        }
    };

    const hasReports = !!messageReports && messageReports.years.length > 0;

    return (
        <>
            <Modal.Body className="flex flex-1 flex-col">
                <SearchCriteriaBox className="mt-0">
                    <DateTimeRangeSelector
                        label="Select a date range"
                        value={dateRange}
                        granularity={granularity}
                        shouldForceLeadingZeros={true}
                        onChange={(next) => setDateRange(next as RangeValue<ZonedDateTime> | null)}
                    />
                    <BusinessDomainSelector
                        identifiers={businessDomainIdentifiers}
                        value={businessDomainIdentifierQuery}
                        onValueChange={onBusinessDomainIdentifierChange}
                    />

                    <div className="flex flex-col">
                        <span className="mb-1 text-sm font-medium invisible" aria-hidden="true">
                            Search
                        </span>
                        <Button
                            variant="primary"
                            isPending={refreshing}
                            isDisabled={!dateRange}
                            onPress={onApplyPress}
                        >
                            <Magnifier/>
                            Search
                        </Button>
                    </div>
                </SearchCriteriaBox>

                {loading && !messageReports && (
                    <SpinnerView className="mt-60"/>
                )}

                {hasLoaded && !loading && !refreshing && messageReports && messageReports.years.length === 0 && (
                    <EmptyState text="No report available" className="flex-1"/>
                )}

                {hasReports && (
                    <div className="flex flex-col">
                        {messageReports!.years.map((content, i) => (
                            <div key={i} className="flex flex-col gap-y-2">
                                <div className="flex items-center gap-3 my-2">
                                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                        {content.year}
                                    </h2>
                                    <span className="h-px flex-1 bg-default-200"/>
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
                                                    <Fragment key={content.year + month.label}>
                                                        {/* group header spanning all columns */}
                                                        <Table.Row>
                                                            <Table.Cell colSpan={5} className="bg-slate-400 text-center font-semibold">
                                                                {month.label}
                                                            </Table.Cell>
                                                        </Table.Row>

                                                        {/* normal data rows for that month */}
                                                        {month.reports.map((report) => (
                                                            <Table.Row key={report.party + report.service}>
                                                                <Table.Cell>{report.party}</Table.Cell>
                                                                <Table.Cell>{report.service}</Table.Cell>
                                                                <Table.Cell>{report.inbound}</Table.Cell>
                                                                <Table.Cell>{report.outbound}</Table.Cell>
                                                                <Table.Cell>{report.total}</Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                        <Table.Row>
                                                            <Table.Cell colSpan={2} className="font-semibold bg-warning-soft">
                                                                Total
                                                            </Table.Cell>
                                                            <Table.Cell className="font-semibold bg-warning-soft">
                                                                {month.totalInbound}
                                                            </Table.Cell>
                                                            <Table.Cell className="font-semibold bg-warning-soft">
                                                                {month.totalOutbound}
                                                            </Table.Cell>
                                                            <Table.Cell className="font-semibold bg-warning-soft">
                                                                {month.total}
                                                            </Table.Cell>
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
                    <Button
                        variant="secondary"
                        aria-label="Export report menu"
                        isDisabled={!hasReports || loading || refreshing}>
                        <ArrowUpFromSquare/>
                        Export
                    </Button>
                    <Dropdown.Popover>
                        <Dropdown.Menu onAction={onExportClick}>
                            <Dropdown.Item id="export-excel" textValue="Excel">
                                <div className="flex h-8 items-start justify-center pt-px">
                                    <ArrowUpFromSquare className="size-4 shrink-0 text-muted"/>
                                </div>
                                <div className="flex flex-col">
                                    <Label>Excel</Label>
                                    <Description>Export to Excel</Description>
                                </div>
                                <Kbd className="ms-auto" slot="keyboard" variant="light">
                                    <Kbd.Abbr keyValue="command"/>
                                    <Kbd.Content>E</Kbd.Content>
                                </Kbd>
                            </Dropdown.Item>
                            <Dropdown.Item id="export-json" textValue="JSON">
                                <div className="flex h-8 items-start justify-center pt-px">
                                    <ArrowUpFromSquare className="size-4 shrink-0 text-muted"/>
                                </div>
                                <div className="flex flex-col">
                                    <Label>JSON</Label>
                                    <Description>Export to JSON format</Description>
                                </div>
                                <Kbd className="ms-auto" slot="keyboard" variant="light">
                                    <Kbd.Abbr keyValue="command"/>
                                    <Kbd.Content>J</Kbd.Content>
                                </Kbd>
                            </Dropdown.Item>
                            <Dropdown.Item id="export-csv" textValue="CSV">
                                <div className="flex h-8 items-start justify-center pt-px">
                                    <ArrowUpFromSquare className="size-4 shrink-0 text-muted"/>
                                </div>
                                <div className="flex flex-col">
                                    <Label>CSV</Label>
                                    <Description>Export to CSV</Description>
                                </div>
                                <Kbd className="ms-auto" slot="keyboard" variant="light">
                                    <Kbd.Abbr keyValue="command"/>
                                    <Kbd.Content>C</Kbd.Content>
                                </Kbd>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </Modal.Footer>
        </>
    );
}

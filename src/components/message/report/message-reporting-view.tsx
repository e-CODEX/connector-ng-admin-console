/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Button, Modal, Spinner, Table, useOverlayState } from "@heroui/react";
import { type RangeValue } from "react-aria-components";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { getMessageReports } from "@/services/message";
import { getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";
import { toastError } from "@/utils";
import { SquareBars } from "@gravity-ui/icons";
import { ConnectorMessageReport } from "@/types/response/reporting";
import { DateTimeRangeGranularity, DateTimeRangeSelector } from "@/components/form/date-time-range-selector";
import { EmptyState } from "@/components/common/empty-state";
import { SearchCriteriaBox } from "@/components/form/search-criteria-box";

interface MessageReportingViewProps {
    state: ReturnType<typeof useOverlayState>;
}

const tz = getLocalTimeZone();
const granularity: DateTimeRangeGranularity = "day";

const todayZoned = now(tz);
const defaultRange: RangeValue<ZonedDateTime> = {
    start: todayZoned,
    end: todayZoned,
};

export function MessageReportingView({ state }: MessageReportingViewProps) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [messageReports, setMessageReports] = useState<ConnectorMessageReport>();
    const [range, setRange] = useState<RangeValue<ZonedDateTime> | null>(defaultRange);
    const [hasLoaded, setHasLoaded] = useState(false);
    const requestId = useRef(0);

    function toReportRange(selected: RangeValue<ZonedDateTime> | null, granularity: DateTimeRangeGranularity,) {
        if (!selected) {
            return { from: "", to: "" };
        }

        let from = selected.start;
        let to = selected.end;

        if (granularity === "day") {
            const startOfDay = { hour: 0, minute: 0, second: 0, millisecond: 0 } as const;
            const endOfDay = { hour: 23, minute: 59, second: 59, millisecond: 0 } as const;
            from = selected.start.set(startOfDay);
            to = selected.end.set(endOfDay);
        }

        return {
            // ZonedDateTime#toDate() -> absolute instant; toISOString() -> UTC.
            from: from.toDate().toISOString(),
            to: to.toDate().toISOString(),
        };
    }

    const loadReports = async (
        selected: RangeValue<ZonedDateTime> | null,
        mode: "load" | "refresh",
    ) => {
        const id = ++requestId.current;

        if (mode === "refresh") {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            // ZonedDateTime#toDate() resolves to an absolute instant; toISOString() -> UTC.
            const data = await getMessageReports(toReportRange(selected, granularity));
            if (id !== requestId.current) {
                return;
            }
            setMessageReports(data);
            setHasLoaded(true);
        } catch (error) {
            if (id !== requestId.current) {
                return;
            }
            toastError(error);
        } finally {
            if (id === requestId.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    };

    useEffect(() => {
        if (state.isOpen) {
            void loadReports(range, "load");
        } else {
            requestId.current++;
            setMessageReports(undefined);
            setRange(defaultRange);
            setLoading(true);
            setRefreshing(false);
            setHasLoaded(false);
        }
    }, [state.isOpen]);

    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-350 sm:min-h-200">
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <SquareBars className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Message Reporting</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body className="flex flex-1 flex-col">
                            <SearchCriteriaBox className="mt-0">
                                <DateTimeRangeSelector
                                    label="Select a date range"
                                    value={range}
                                    granularity={granularity}
                                    shouldForceLeadingZeros={true}
                                    onChange={(next) => setRange(next as RangeValue<ZonedDateTime> | null)}
                                />
                                <div className="flex flex-col">
                                    <span className="mb-1 text-sm font-medium invisible" aria-hidden="true">
                                        Apply
                                    </span>
                                    <Button
                                        variant="primary"
                                        isPending={refreshing}
                                        isDisabled={!range}
                                        onPress={() => void loadReports(range, "refresh")}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </SearchCriteriaBox>

                            {loading && !messageReports && (
                                <div className="flex justify-center items-center min-h-400]">
                                    <Spinner size="lg"/>
                                </div>
                            )}

                            {hasLoaded && !loading && !refreshing && messageReports && messageReports.years.length === 0 && (
                                <EmptyState text="No report available" className="flex-1"/>
                            )}

                            {messageReports && messageReports.years.length > 0 && (
                                <div className="flex flex-col">
                                    {messageReports.years.map((content, i) => (
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
                                                                    {/* group header spanning all 4 columns */}
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
                            <Button slot="close" variant="tertiary">Close</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}


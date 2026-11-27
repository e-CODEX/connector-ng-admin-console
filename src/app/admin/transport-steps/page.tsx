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
import React, { useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Table, useOverlayState } from "@heroui/react";
import { TransportStepFiltersPanel } from "@/components/transport-step/transport-step-filters-panel";
import { PagedListView } from "@/components/paging/paged-list-view";
import type { ConnectorTransportStep } from "@/types/response/transport-step";
import { TransportStepDetailsView } from "@/components/transport-step/transport-step-details-view";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { TransportStepMessageTypeChip } from "@/components/message/chip/message-type-chip";
import { TransportDeliveryStatusChip } from "@/components/transport-step/transport-step-status-chip";
import { CheckCheck, Mail, MailClock, RefreshCw, RotateCcw, Route } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { usePagedList } from "@/hooks/use-paged-list";
import { DateTime } from "@/components/common/date-time";
import { useMessageService, useTransportStepService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DetailActionButton } from "@/components/common/action-button/detail-action-button";
import { asFilter, toastError, toastSuccess } from "@/utils";
import { ALL_SELECTOR } from "@/types/global";
import type { TransportStepStatusesFilter } from "@/components/form/selector/transport-step-status-multi-selector";
import type { DateTimeRangeGranularity } from "@/components/form/selector/date-time-range-selector";
import type { RangeValue } from "react-aria-components";
import type { ZonedDateTime } from "@internationalized/date";
import { buildDefaultRange, isDefaultRange, toDateRange } from "@/types/period";
import { TransportedStepMessageDetailsView } from "@/components/transport-step/transported-step-message-details-view";
import { ActionButton } from "@/components/common/action-button/action-button";
import { useAppConfig } from "@/hooks/use-app-config";
import { MessagePendingView } from "@/components/message/pending/message-pending-view";
import { BooleanChip } from "@/components/common/boolean-chip";
import { ConfirmModal } from "@/components/common/confirmation-modal";

const IDENTIFIER_LENGTH = 30;
const RETRY_FEEDBACK_MS = 3000;

const granularity: DateTimeRangeGranularity = "minute";

const asStatusesFilter = (values: TransportStepStatusesFilter[]) => (values.length === 0 || values.includes(ALL_SELECTOR) ? undefined : values);

export default function TransportStepsAdminPage() {
    const [selectedTransportStep, setSelectedTransportStep] = useState<ConnectorTransportStep | null>(null);
    const [messageOrRemoteSystemIdentifierQuery, setMessageOrRemoteSystemIdentifierQuery] = useState("");
    const [linkPartnerNameQuery, setLinkPartnerNameQuery] = useState("");
    const [statusesQuery, setStatusesQuery] = useState({ statuses: [] as TransportStepStatusesFilter[] });
    const [dateRange, setDateRange] = useState<RangeValue<ZonedDateTime> | null>(buildDefaultRange);
    const [acknowledging, setAcknowledging] = useState(false);
    const [retryTarget, setRetryTarget] = useState<ConnectorTransportStep | null>(null);

    const debouncedMessageOrRemoteSystemIdentifier = useDebouncedValue(messageOrRemoteSystemIdentifierQuery);
    const debouncedLinkPartnerName = useDebouncedValue(linkPartnerNameQuery);
    const { appMode } = useAppConfig();

    const isTestingMode = appMode === "TESTING_CONSOLE";

    const transportStepService = useTransportStepService();
    const messageService = useMessageService();

    const pagedList = usePagedList<ConnectorTransportStep>(
        ({ page, size }) =>
            transportStepService.listTransportSteps({
                page,
                size,
                stepOrMessageOrRemoteSystemIdentifier: asFilter(debouncedMessageOrRemoteSystemIdentifier),
                linkPartnerName: asFilter(debouncedLinkPartnerName),
                statuses: asStatusesFilter(statusesQuery.statuses),
                ...toDateRange(dateRange, granularity),
            }),
        [debouncedMessageOrRemoteSystemIdentifier, debouncedLinkPartnerName, statusesQuery, dateRange],
    );

    const detailsModal = useOverlayState();
    const transportedMessageDetailsModal = useOverlayState();
    const pendingMessagesModal = useOverlayState();
    const confirmRetryModal = useOverlayState();

    const onMessageOrRemoteSystemIdentifierChange = (value: string) => {
        setMessageOrRemoteSystemIdentifierQuery(value);
        pagedList.setPage(1);
    };

    const onLinkPartnerNameChange = (value: string) => {
        setLinkPartnerNameQuery(value);
        pagedList.setPage(1);
    };

    const onStatusesChange = (statuses: TransportStepStatusesFilter[]) => {
        if (statuses.length === 0 || statuses.includes(ALL_SELECTOR)) {
            setStatusesQuery({ statuses: [] });
        } else {
            setStatusesQuery((prev) => ({ ...prev, statuses }));
        }
        pagedList.setPage(1);
    };

    const onDateRangeChange = (next: unknown) => {
        setDateRange(next as RangeValue<ZonedDateTime> | null);
        pagedList.setPage(1);
    };

    const hasCustomCriteria =
        messageOrRemoteSystemIdentifierQuery !== "" ||
        linkPartnerNameQuery !== "" ||
        statusesQuery.statuses.length > 0 ||
        !isDefaultRange(dateRange);

    const onClearCriteria = () => {
        setMessageOrRemoteSystemIdentifierQuery("");
        setLinkPartnerNameQuery("");
        setStatusesQuery({ statuses: [] });
        setDateRange(buildDefaultRange());
        pagedList.setPage(1);
    };

    const onDetailsClick = (step: ConnectorTransportStep) => {
        setSelectedTransportStep(step);
        detailsModal.open();
    };

    const onTransportedMessageDetailsClick = (step: ConnectorTransportStep) => {
        setSelectedTransportStep(step);
        transportedMessageDetailsModal.open();
    };

    const onAcknowledgeClick = async (step: ConnectorTransportStep) => {
        if (acknowledging) return;
        setAcknowledging(true);
        try {
            await messageService.acknowledgePendingMessage(step.identifier);
            toastSuccess(`Message related to transport ID [${step.identifier}] acknowledged successfully.`);
            pagedList.refresh();
        } catch (error) {
            toastError(error);
        } finally {
            setAcknowledging(false);
        }
    };

    const onRetryClick = (step: ConnectorTransportStep) => {
        setRetryTarget(step);
        confirmRetryModal.open();
    };

    const onRetryConfirmed = async () => {
        if (!retryTarget) return;
        const startedAt = Date.now();
        try {
            await transportStepService.retry(retryTarget.identifier);
            // Keep the spinner up for a moment so the retry is noticed before the modal closes.
            const remaining = RETRY_FEEDBACK_MS - (Date.now() - startedAt);
            if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
            toastSuccess(`Transport step [${retryTarget.identifier}] submitted for retry.`);
            confirmRetryModal.close();
            setRetryTarget(null);
            pagedList.refresh();
        } catch (error) {
            toastError(error);
        }
    };

    const onRetryCancelled = () => {
        confirmRetryModal.close();
        setRetryTarget(null);
    };

    const canAcknowledgeReception = (step: ConnectorTransportStep): boolean => isTestingMode && step.status === "PULLED";

    return (
        <div>
            <PageHeader icon={Route} title="Message Transport Steps" subtitle="Track message transport steps">
                {isTestingMode && <PageHeaderButton variant="primary" tooltip="See pending messages" icon={MailClock} onPress={pendingMessagesModal.open} />}

                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={RefreshCw}
                    onPress={pagedList.refresh}
                    isDisabled={pagedList.refreshing}
                    isSpinning={pagedList.refreshing || pagedList.loading}
                />
            </PageHeader>

            <TransportStepFiltersPanel
                messageOrRemoteSystemIdentifier={messageOrRemoteSystemIdentifierQuery}
                linkPartnerName={linkPartnerNameQuery}
                statuses={statusesQuery.statuses}
                dateRange={dateRange}
                dateGranularity={granularity}
                onMessageOrRemoteSystemIdentifierChange={onMessageOrRemoteSystemIdentifierChange}
                onLinkPartnerNameChange={onLinkPartnerNameChange}
                onStatusesChange={onStatusesChange}
                onDateRangeChange={onDateRangeChange}
                onClear={onClearCriteria}
                canClear={hasCustomCriteria}
            />

            <PagedListView list={pagedList} errorMessage="Could not load messages transport steps">
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Connector messages transport steps">
                            <Table.Header>
                                <Table.Column isRowHeader>Identifier</Table.Column>
                                <Table.Column>Transported Message ID</Table.Column>
                                <Table.Column>Link Partner Name</Table.Column>
                                <Table.Column>Remote System Identifier</Table.Column>
                                <Table.Column>Message Type</Table.Column>
                                <Table.Column>Attempts</Table.Column>
                                <Table.Column>Status</Table.Column>
                                <Table.Column>Retryable</Table.Column>
                                <Table.Column>Created at</Table.Column>
                                <Table.Column>Actions</Table.Column>
                            </Table.Header>
                            <Table.Body
                                renderEmptyState={() => <EmptyState text="No transport step available" className="py-16" />}
                            >
                                {pagedList.items.map((transportStep) => (
                                    <Table.Row key={transportStep.identifier}>
                                        <Table.Cell>
                                            <CopyableIdentifier identifier={transportStep.identifier} visibleChars={IDENTIFIER_LENGTH} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <CopyableIdentifier identifier={transportStep.transportedMessageIdentifier} visibleChars={IDENTIFIER_LENGTH} />
                                        </Table.Cell>
                                        <Table.Cell>{transportStep.linkPartnerName}</Table.Cell>
                                        <Table.Cell>
                                            <CopyableIdentifier identifier={transportStep.remoteSystemIdentifier} visibleChars={IDENTIFIER_LENGTH} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <TransportStepMessageTypeChip messageType={transportStep.messageType} />
                                        </Table.Cell>
                                        <Table.Cell>{transportStep.numberOfAttempts}</Table.Cell>
                                        <Table.Cell>
                                            <TransportDeliveryStatusChip status={transportStep.status} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <BooleanChip value={transportStep.isRetryable} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <DateTime value={transportStep.createdAt} precision="millis" />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center gap-1">
                                                <DetailActionButton onPress={() => onDetailsClick(transportStep)} />
                                                <ActionButton
                                                    label="Transported message details"
                                                    icon={Mail}
                                                    onPress={() => onTransportedMessageDetailsClick(transportStep)}
                                                />
                                                {transportStep.isRetryable && (
                                                    <ActionButton label="Retry" icon={RotateCcw} iconAccent="text-info" onPress={() => onRetryClick(transportStep)} />
                                                )}
                                                {canAcknowledgeReception(transportStep) && (
                                                    <ActionButton
                                                        label="Acknowledge reception"
                                                        icon={CheckCheck}
                                                        iconAccent="text-warning"
                                                        onPress={() => onAcknowledgeClick(transportStep)}
                                                    />
                                                )}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </PagedListView>

            <TransportStepDetailsView transportStep={selectedTransportStep} state={detailsModal} />

            <TransportedStepMessageDetailsView transportStep={selectedTransportStep} state={transportedMessageDetailsModal} />

            <MessagePendingView state={pendingMessagesModal} onDownloaded={pagedList.refresh} />

            <ConfirmModal
                isDismissable={false}
                state={confirmRetryModal}
                title="Retry transport step"
                message={
                    retryTarget && (
                        <>
                            Message <span className="break-all font-medium text-orange-500">{retryTarget.transportedMessageIdentifier}</span> will be sent again to{" "}
                            <strong>{retryTarget.linkPartnerName}</strong> (transport step <span className="break-all font-mono text-orange-500">{retryTarget.identifier}</span>).
                            Continue?
                        </>
                    )
                }
                confirmLabel="Retry"
                onConfirm={onRetryConfirmed}
                onCancel={onRetryCancelled}
            />

            {acknowledging && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
                    <SpinnerView />
                </div>
            )}
        </div>
    );
}

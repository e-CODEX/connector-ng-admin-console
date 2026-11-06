/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client"

import React, { useState } from "react";
import { ConnectorMessage } from "@/types/response/message";
import { Table, useOverlayState } from "@heroui/react";
import { PaginationControls } from "@/components/paging/pagination-controls";
import { MessageTransportStepsDetailView } from "@/components/message/detail/message-transport-steps-detail-view";
import { PageHeader } from "@/components/common/header/page-header";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { MessageFiltersPanel } from "@/components/message/message-filters-panel";
import { MessageDetailsView } from "@/components/message/detail/message-details-view";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { MessageReportingView } from "@/components/message/report/message-reporting-view";
import { MessageDirectionChip } from "@/components/message/chip/message-direction-chip";
import { MessageDeliveryStatusChip } from "@/components/message/chip/message-delivery-status-chip";
import { ChartPie, Info, Mail, MailCheck, MailClock, RefreshCw, Route } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";
import { asBusinessDomainSelectorFilter } from "@/components/form/selector/business-domain-selector";
import { usePagedList } from "@/hooks/use-paged-list";
import { useProcessingModeServices } from "@/hooks/use-processing-mode-services";
import { ConnectorProcessingModeService } from "@/types/response/processing-mode";
import { DateTime } from "@/components/common/date-time";
import { useMessageService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { ActionButton } from "@/components/common/action-button/action-button";
import { DetailActionButton } from "@/components/common/action-button/detail-action-button";
import { asFilter, toastError, toastSuccess } from "@/utils";
import { ALL_SELECTOR } from "@/types/global";
import type { RangeValue } from "react-aria-components";
import { ZonedDateTime } from "@internationalized/date";
import { buildDefaultRange, toDateRange } from "@/types/period";
import { DateTimeRangeGranularity } from "@/components/form/selector/date-time-range-selector";
import { useAppConfig } from "@/hooks/use-app-config";
import { MessageEvidenceTriggerModeView } from "@/components/message/evidence-trigger/message-evidence-trigger-mode-view";
import { MessageEvidenceTriggerResponse } from "@/types/response/evidence-trigger";
import { MessagePendingView } from "@/components/message/pending/message-pending-view";
import { MessageLifecycleView } from "@/components/message/message-lifecycle-view";
import { LoadErrorState } from "@/components/common/load-error-state";

const IDENTIFIER_LENGTH = 8;

const granularity: DateTimeRangeGranularity = "minute";

export default function MessagesAdminPage() {
    const [selectedMessage, setSelectedMessage] = useState<ConnectorMessage | null>(null);
    const [identifierQuery, setIdentifierQuery] = useState("");
    const [backendNameQuery, setBackendNameQuery] = useState("");
    const [messageDirectionQuery, setMessageDirectionQuery] = useState(ALL_SELECTOR);
    const [businessDomainIdentifierQuery, setBusinessDomainIdentifierQuery] = useState(ALL_SELECTOR);
    const [processingModeServiceQuery, setProcessingModeServiceQuery] = useState(ALL_SELECTOR);
    const [dateRange, setDateRange] = useState<RangeValue<ZonedDateTime> | null>(buildDefaultRange);
    const debouncedIdentifier = useDebouncedValue(identifierQuery);
    const debouncedBackendName = useDebouncedValue(backendNameQuery);
    const { appMode } = useAppConfig();

    const isTestingMode = appMode === "TESTING_CONSOLE";

    const businessDomainIdentifiers = useBusinessDomainIdentifiers(ALL_SELECTOR);
    const processingModeServices = useProcessingModeServices(businessDomainIdentifierQuery, ALL_SELECTOR);

    const messageService = useMessageService();

    const pagedList = usePagedList<ConnectorMessage>(
        ({ page, size }) =>
            messageService.listMessages({
                page,
                size,
                identifier: asFilter(debouncedIdentifier),
                backendName: asFilter(debouncedBackendName),
                direction: asFilter(messageDirectionQuery),
                businessDomain: asBusinessDomainSelectorFilter(businessDomainIdentifierQuery, ALL_SELECTOR),
                service: asFilter(processingModeServiceQuery),
                ...toDateRange(dateRange, granularity),
            }),
        [
            debouncedIdentifier,
            debouncedBackendName,
            messageDirectionQuery,
            businessDomainIdentifierQuery,
            processingModeServiceQuery,
            dateRange
        ],
    );

    const onIdentifierChange = (value: string) => {
        setIdentifierQuery(value);
        pagedList.setPage(1);
    };

    const onBackendNameChange = (value: string) => {
        setBackendNameQuery(value);
        pagedList.setPage(1);
    };

    const onDirectionChange = (value: string | null) => {
        setMessageDirectionQuery(value!);
        pagedList.setPage(1);
    };

    const onBusinessDomainIdentifierChange = (value: string) => {
        setProcessingModeServiceQuery(ALL_SELECTOR);
        setBusinessDomainIdentifierQuery(value);
        pagedList.setPage(1);
    };

    const onProcessingModeServiceChange = (service: ConnectorProcessingModeService | null) => {
        setProcessingModeServiceQuery(service!.name);
        pagedList.setPage(1);
    };

    const useRefreshOnClose = (refresh: () => void) => {
        return useOverlayState({
            onOpenChange: (isOpen) => {
                if (!isOpen) refresh();
            },
        });
    }

    const detailsModal = useRefreshOnClose(pagedList.refresh);
    const transportModal = useRefreshOnClose(pagedList.refresh);
    const reportModal = useRefreshOnClose(pagedList.refresh);
    const evidenceTriggerModal = useRefreshOnClose(pagedList.refresh);
    const pendingMessagesModal = useRefreshOnClose(pagedList.refresh);
    const helpModal = useRefreshOnClose(pagedList.refresh);

    const onDetailsClick = (message: ConnectorMessage) => {
        setSelectedMessage(message);
        detailsModal.open();
    };

    const onTransportStepsClick = (message: ConnectorMessage) => {
        setSelectedMessage(message);
        transportModal.open();
    };

    const onDeliveryAckClick = (message: ConnectorMessage) => {
        setSelectedMessage(message);
        evidenceTriggerModal.open();
    };

    const onReportClicked = () => {
        reportModal.open();
    }

    const onPendingMessagesClicked = () => {
        pendingMessagesModal.open();
    }

    const onHelpClicked = () => {
        helpModal.open();
    }

    const canTriggerDeliveryEvidence = (message: ConnectorMessage): boolean => {
        return isTestingMode
            && message.direction == "GATEWAY_TO_BACKEND"
            && message.confirmedAt == null
            && message.deliveredToLinkPartnerAt != null
    }

    return (
        <div>
            <PageHeader
                icon={Mail}
                title="Business Messages"
                subtitle="The connector processed business messages"
            >

                {isTestingMode && (
                    <PageHeaderButton
                        variant="primary"
                        tooltip="Show pending messages"
                        icon={MailClock}
                        onPress={onPendingMessagesClicked}
                    />
                )}

                <PageHeaderButton
                    variant="tertiary"
                    tooltip="Messages lifecycle explanation"
                    icon={Info}
                    onPress={onHelpClicked}
                />

                <PageHeaderButton
                    variant="outline"
                    tooltip="Show reporting"
                    icon={ChartPie}
                    onPress={onReportClicked}
                />

                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={RefreshCw}
                    onPress={pagedList.refresh}
                    isDisabled={pagedList.refreshing}
                    isSpinning={pagedList.refreshing || pagedList.loading}
                />
            </PageHeader>

            <MessageFiltersPanel
                identifier={identifierQuery}
                backendName={backendNameQuery}
                direction={messageDirectionQuery}
                businessDomainIdentifier={businessDomainIdentifierQuery}
                processingModeService={processingModeServiceQuery}
                businessDomainIdentifiers={businessDomainIdentifiers}
                processingModesServices={processingModeServices.items}
                dateRange={dateRange}
                dateGranularity={granularity}
                onIdentifierChange={onIdentifierChange}
                onBackendNameChange={onBackendNameChange}
                onBusinessDomainIdentifierChange={onBusinessDomainIdentifierChange}
                onProcessingModesServiceChange={onProcessingModeServiceChange}
                onDirectionChange={onDirectionChange}
                onDateRangeChange={(next) => setDateRange(next as RangeValue<ZonedDateTime> | null)}
            />

            {pagedList.loading ? (
                <SpinnerView className="mt-60"/>
            ) : pagedList.loadError ? (
                <LoadErrorState
                    title="Could not load messages"
                    onRetry={pagedList.retry}
                />
            ) : (
                <>
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Connector business messages">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Conversation ID</Table.Column>
                                    <Table.Column>Business domain</Table.Column>
                                    <Table.Column>Backend ID</Table.Column>
                                    <Table.Column>From</Table.Column>
                                    <Table.Column>To</Table.Column>
                                    <Table.Column>Backend</Table.Column>
                                    <Table.Column>Gateway</Table.Column>
                                    <Table.Column>Service</Table.Column>
                                    <Table.Column>Action</Table.Column>
                                    <Table.Column>Direction</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Action.s</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {pagedList.items.map((message) => (
                                        <Table.Row key={message.identifier}>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={message.identifier} visibleChars={IDENTIFIER_LENGTH}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={message.as4Properties.conversationIdentifier}
                                                                    visibleChars={IDENTIFIER_LENGTH}/>
                                            </Table.Cell>
                                            <Table.Cell>{message.businessDomainIdentifier}</Table.Cell>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={message.backendMessageIdentifier} visibleChars={IDENTIFIER_LENGTH}/>
                                            </Table.Cell>
                                            <Table.Cell>{message.as4Properties.fromParty.identifier}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.toParty.identifier}</Table.Cell>
                                            <Table.Cell>{message.backendName}</Table.Cell>
                                            <Table.Cell>{message.gatewayName}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.service.name}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.action.name}</Table.Cell>
                                            <Table.Cell>
                                                <MessageDirectionChip
                                                    labelVariant="short"
                                                    direction={message.direction}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <MessageDeliveryStatusChip message={message}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <DateTime value={message.createdAt} precision="millis"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <DetailActionButton onPress={() => onDetailsClick(message)}/>
                                                    <ActionButton label="Transport steps" icon={Route}
                                                                  onPress={() => onTransportStepsClick(message)}/>
                                                    {canTriggerDeliveryEvidence(message) &&
                                                        <ActionButton label="Send delivery evidence"
                                                                      icon={MailCheck}
                                                                      iconAccent="text-success"
                                                                      onPress={() => onDeliveryAckClick(message)}/>
                                                    }
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {pagedList.items.length === 0 && !pagedList.refreshing && (
                        <EmptyState text="No message available" className="mt-50"/>
                    )}

                    {
                        pagedList.totalElements > 0 && (
                            <div className="flex justify-center mt-4">
                                <PaginationControls
                                    page={pagedList.page}
                                    pageSize={pagedList.pageSize}
                                    totalElements={pagedList.totalElements}
                                    onPageChange={pagedList.setPage}
                                    onPageSizeChange={pagedList.setPageSize}
                                />
                            </div>
                        )
                    }
                </>
            )}

            <MessageLifecycleView state={helpModal}/>

            <MessageDetailsView
                message={selectedMessage}
                state={detailsModal}
            />

            <MessageTransportStepsDetailView
                message={selectedMessage}
                state={transportModal}
            />

            <MessageReportingView state={reportModal}/>

            <MessageEvidenceTriggerModeView
                message={selectedMessage}
                state={evidenceTriggerModal}
                evidenceType={"DELIVERY"}
                onSubmit={async (payload) => {
                    let response: MessageEvidenceTriggerResponse;
                    try {
                        response = await messageService.sendEvidenceTrigger(payload);
                    } catch (error) {
                        toastError(error);
                        return;
                    }

                    toastSuccess(`Evidence trigger sent successfully with ${response.identifier} as created message identifier.`);
                    evidenceTriggerModal.close();
                    pagedList.refresh();

                    return response;
                }}
            />

            <MessagePendingView state={pendingMessagesModal} onDownloaded={pagedList.refresh}/>
        </div>
    )
}

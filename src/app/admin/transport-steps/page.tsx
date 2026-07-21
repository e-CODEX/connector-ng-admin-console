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

import { PageHeader } from "@/components/common/page-header";
import React, { useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button, Table, Tooltip, useOverlayState } from "@heroui/react";
import { listTransportSteps } from "@/services/transport-step";
import { TransportStepFiltersPanel } from "@/components/transport-step/transport-step-filters-panel";
import { formatDate, truncate } from "@/utils";
import { PaginationControls } from "@/components/paging/pagination-controls";
import { ConnectorTransportStepResponse } from "@/types/response/transport-step";
import { TransportStepDetailsView } from "@/components/transport-step/transport-step-details-view";
import { ArrowsRotateRight, Eye } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { TransportStepMessageTypeChip } from "@/components/message/chip/message-type-chip";
import { TransportDeliveryStatusChip } from "@/components/transport-step/transport-step-status-chip";
import { Route } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { usePagedList } from "@/hooks/use-paged-list";

export default function TransportStepsAdminPage() {
    const [selectedTransportStep, setSelectedTransportStep] = useState<ConnectorTransportStepResponse | null>(null);
    const [messageOrRemoteSystemIdentifierQuery, setMessageOrRemoteSystemIdentifierQuery] = useState("");
    const [linkPartnerNameQuery, setLinkPartnerNameQuery] = useState("");
    const debouncedMessageOrRemoteSystemIdentifier = useDebouncedValue(messageOrRemoteSystemIdentifierQuery);
    const debouncedLinkPartnerName = useDebouncedValue(linkPartnerNameQuery);

    const pagedList = usePagedList<ConnectorTransportStepResponse>(
        ({ page, size }) =>
            listTransportSteps({
                page,
                size,
                messageOrRemoteSystemIdentifier: debouncedMessageOrRemoteSystemIdentifier || undefined,
                linkPartnerName: debouncedLinkPartnerName || undefined,
            }),
        [debouncedMessageOrRemoteSystemIdentifier, debouncedLinkPartnerName],
    );

    const onMessageOrRemoteSystemIdentifierChange = (value: string) => {
        setMessageOrRemoteSystemIdentifierQuery(value);
        pagedList.setPage(1);
    };

    const onLinkPartnerNameChange = (value: string) => {
        setLinkPartnerNameQuery(value);
        pagedList.setPage(1);
    };

    const detailsModal = useOverlayState();

    const onDetailsClick = (step: ConnectorTransportStepResponse) => {
        setSelectedTransportStep(step);
        detailsModal.open();
    };

    return (
        <div>
            <PageHeader
                icon={Route}
                title="Message Transport Steps"
                subtitle="Track message transport steps"
            >
                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={ArrowsRotateRight}
                    onPress={pagedList.refresh}
                    isDisabled={pagedList.refreshing}
                    isSpinning={pagedList.refreshing || pagedList.loading}
                />
            </PageHeader>
            <TransportStepFiltersPanel
                messageOrRemoteSystemIdentifier={messageOrRemoteSystemIdentifierQuery}
                linkPartnerName={linkPartnerNameQuery}
                onMessageOrRemoteSystemIdentifierChange={onMessageOrRemoteSystemIdentifierChange}
                onLinkPartnerNameChange={onLinkPartnerNameChange}
            />

            {pagedList.loading ? (
                <SpinnerView className="mt-60"/>
            ) : (
                <>
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
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Actions</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {pagedList.items.map((transportStep) => (
                                        <Table.Row key={transportStep.identifier}>
                                            <Table.Cell>
                                                <Tooltip delay={0}>
                                                        <span
                                                            className="font-semibold truncate inline-block">
                                                            {truncate(transportStep.identifier)}
                                                        </span>
                                                    <Tooltip.Content showArrow>
                                                        <Tooltip.Arrow/>
                                                        <p>{transportStep.identifier}</p>
                                                    </Tooltip.Content>
                                                </Tooltip>
                                            </Table.Cell>
                                            <Table.Cell>{truncate(transportStep.transportedMessageIdentifier)}</Table.Cell>
                                            <Table.Cell>{transportStep.linkPartnerName}</Table.Cell>
                                            <Table.Cell>{truncate(transportStep.remoteSystemIdentifier)}</Table.Cell>
                                            <Table.Cell>{
                                                <TransportStepMessageTypeChip messageType={transportStep.messageType}/>
                                            }</Table.Cell>
                                            <Table.Cell>{transportStep.numberOfAttempts}</Table.Cell>
                                            <Table.Cell>
                                                <TransportDeliveryStatusChip status={transportStep.status}/>
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(transportStep.createdAt)}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <Tooltip delay={0}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="tertiary"
                                                            onPress={() => onDetailsClick(
                                                                transportStep)}
                                                        >
                                                            <Eye/>
                                                        </Button>
                                                        <Tooltip.Content showArrow>
                                                            <Tooltip.Arrow/>
                                                            <p>Details</p>
                                                        </Tooltip.Content>
                                                    </Tooltip>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {pagedList.items.length === 0 && !pagedList.refreshing && (
                        <EmptyState text="No transport step available" className="mt-70"/>
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

                    <TransportStepDetailsView transportStep={selectedTransportStep} state={detailsModal}/>
                </>
            )}
        </div>
    )
}

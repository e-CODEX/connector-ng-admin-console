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
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button, Chip, Spinner, Table, Tooltip, useOverlayState } from "@heroui/react";
import { listTransportSteps } from "@/services/transport-step";
import { TransportStepFiltersPanel } from "@/components/transport-step/transport-step-filters-panel";
import { formatDate, getTransportDeliveryColor, getTransportDeliveryLabel, toastError, truncate } from "@/utils";
import { Icon } from "@iconify/react";
import { PaginationControls } from "@/components/paging/pagination-controls";
import { ConnectorTransportStepResponse } from "@/types/response/transport-step";
import { TransportStepDetailsView } from "@/components/transport-step/transport-step-details-view";
import { ArrowsRotateRight } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";

export default function TransportStepsAdminPage() {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [pageSize, setPageSize] = useState(20);
    const [selectedTransportStep, setSelectedTransportStep] = useState<ConnectorTransportStepResponse | null>(null);
    const [transportSteps, setTransportSteps] = useState<ConnectorTransportStepResponse[]>([])
    const [messageOrRemoteSystemIdentifierQuery, setMessageOrRemoteSystemIdentifierQuery] = useState("")
    const [linkPartnerNameQuery, setLinkPartnerNameQuery] = useState("")
    const debouncedMessageOrRemoteSystemIdentifier = useDebouncedValue(messageOrRemoteSystemIdentifierQuery)
    const debouncedLinkPartnerName = useDebouncedValue(linkPartnerNameQuery)
    const requestId = useRef(0);

    const onMessageOrRemoteSystemIdentifierChange = (value: string) => {
        setMessageOrRemoteSystemIdentifierQuery(value)
        setPage(1)
    }

    const onLinkPartnerNameChange = (value: string) => {
        setLinkPartnerNameQuery(value)
        setPage(1)
    }

    const detailsModal = useOverlayState();

    const onDetailsClick = (step: ConnectorTransportStepResponse) => {
        setSelectedTransportStep(step);
        detailsModal.open();
    };

    const onRefreshClick = async () => {
        setRefreshing(true)
        try {
            await loadTransportSteps();
        } finally {
            setRefreshing(false);
        }
    }

    const loadTransportSteps = useCallback(async () => {
        const id = ++requestId.current;
        setLoading(true)
        try {
            const data = await listTransportSteps({
                page: page - 1,
                size: pageSize,
                messageOrRemoteSystemIdentifier: debouncedMessageOrRemoteSystemIdentifier || undefined,
                linkPartnerName: debouncedLinkPartnerName || undefined,
            })

            if (id !== requestId.current) {
                return;
            }

            setTransportSteps(data.content || [])
            setTotalElements(data.totalElements || 0)
        } catch (error) {
            if (id !== requestId.current) {
                return;
            }

            toastError(error)
        } finally {
            if (id === requestId.current) {
                setLoading(false);
            }
        }
    }, [page, pageSize, debouncedMessageOrRemoteSystemIdentifier, debouncedLinkPartnerName]);

    useEffect(() => {
        void loadTransportSteps();
    }, [loadTransportSteps]);

    return (
        <div>
            <PageHeader
                icon="streamline-pixel:transportation-truck"
                title="Message Transport Steps"
                subtitle="Track message transport steps"
            >
                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                    isDisabled={refreshing}
                    isSpinning={refreshing || loading}
                />
            </PageHeader>
            <TransportStepFiltersPanel
                messageOrRemoteSystemIdentifier={messageOrRemoteSystemIdentifierQuery}
                linkPartnerName={linkPartnerNameQuery}
                onMessageOrRemoteSystemIdentifierChange={onMessageOrRemoteSystemIdentifierChange}
                onLinkPartnerNameChange={onLinkPartnerNameChange}
            />

            {loading ? (
                <div className="flex justify-center items-center min-h-400]">
                    <Spinner size="lg"/>
                </div>
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
                                    {transportSteps.map((transportStep) => (
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
                                            <Table.Cell>{transportStep.messageType}</Table.Cell>
                                            <Table.Cell>{transportStep.numberOfAttempts}</Table.Cell>
                                            <Table.Cell>
                                                <Chip
                                                    color={getTransportDeliveryColor(transportStep.status)}
                                                    size="sm"
                                                    variant="soft"
                                                >
                                                    <Chip.Label>{getTransportDeliveryLabel(
                                                        transportStep.status)}</Chip.Label>
                                                </Chip>
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
                                                            <Icon
                                                                className="size-4"
                                                                icon="gravity-ui:eye"
                                                            />
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

                    {
                        totalElements > 0 && (

                            <div className="flex justify-center mt-4">
                                <PaginationControls
                                    page={page}
                                    pageSize={pageSize}
                                    totalElements={totalElements}
                                    onPageChange={setPage}
                                    onPageSizeChange={setPageSize}
                                />
                            </div>
                        )
                    }

                    <TransportStepDetailsView transportStep={selectedTransportStep}
                                              state={detailsModal}/>
                </>
            )}
        </div>
    )
}

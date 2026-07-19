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

import { useCallback, useEffect, useRef, useState } from "react";
import { ConnectorMessage } from "@/types/response/message";
import { listMessages } from "@/services/message";
import { Button, Spinner, Table, Tooltip, useOverlayState } from "@heroui/react";
import { formatDate, toastError, truncate } from "@/utils";
import { PaginationControls } from "@/components/paging/pagination-controls";
import { MessageTransportStepsDetailView } from "@/components/message/detail/message-transport-steps-detail-view";
import { PageHeader } from "@/components/common/page-header";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { MessageFiltersPanel } from "@/components/message/message-filters-panel";
import { MessageDetailsView } from "@/components/message/detail/message-details-view";
import { ArrowsRotateRight, Eye, SquareBars } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { MessageReportingView } from "@/components/message/report/message-reporting-view";
import { MessageDirectionChip } from "@/components/message/chip/message-direction-chip";
import { MessageDeliveryStatusChip } from "@/components/message/chip/message-delivery-status-chip";
import { Mail, Route } from "lucide-react";

const IDENTIFIER_LENGTH = 15;

export default function MessagesAdminPage() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [messages, setMessages] = useState<ConnectorMessage[]>([]);
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [selectedMessage, setSelectedMessage] = useState<ConnectorMessage | null>(null);
    const [identifierQuery, setIdentifierQuery] = useState("");
    const [backendNameQuery, setBackendNameQuery] = useState("");
    const requestId = useRef(0);

    const debouncedIdentifier = useDebouncedValue(identifierQuery);
    const debouncedBackendName = useDebouncedValue(backendNameQuery);

    const onIdentifierChange = (value: string) => {
        setIdentifierQuery(value)
        setPage(1)
    }

    const onBackendNameChange = (value: string) => {
        setBackendNameQuery(value)
        setPage(1)
    }

    const detailsModal = useOverlayState();
    const transportModal = useOverlayState();
    const reportModal = useOverlayState();

    const onDetailsClick = (message: ConnectorMessage) => {
        setSelectedMessage(message);
        detailsModal.open();
    };

    const onTransportStepsClick = (message: ConnectorMessage) => {
        setSelectedMessage(message);
        transportModal.open();
    };

    const onRefreshClick = async () => {
        setRefreshing(true)
        try {
            await loadMessages();
        } finally {
            setRefreshing(false);
        }
    }

    const onReportClicked = () => {
        reportModal.open();
    }

    const loadMessages = useCallback(async () => {
        const id = ++requestId.current;
        setLoading(true);
        try {
            const data = await listMessages({
                page: page - 1,
                size: pageSize,
                identifier: debouncedIdentifier || undefined,
                backendName: debouncedBackendName || undefined,
            });

            if (id !== requestId.current) {
                return;
            }

            setMessages(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            if (id !== requestId.current) {
                return;
            }

            toastError(error);
        } finally {
            if (id === requestId.current) {
                setLoading(false);
            }
        }
    }, [page, pageSize, debouncedIdentifier, debouncedBackendName]);

    useEffect(() => {
        void loadMessages();
    }, [loadMessages]);

    return (
        <div>
            <PageHeader
                icon={Mail}
                title="Business Messages"
                subtitle="Connector eDelivery inbox"
            >
                <PageHeaderButton
                    variant="primary"
                    tooltip="See reporting"
                    icon={SquareBars}
                    onPress={onReportClicked}
                />

                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                    isDisabled={refreshing}
                    isSpinning={refreshing || loading}
                />
            </PageHeader>
            <MessageFiltersPanel
                identifier={identifierQuery}
                backendName={backendNameQuery}
                onIdentifierChange={onIdentifierChange}
                onBackendNameChange={onBackendNameChange}
            />
            {loading ? (
                <div className="flex justify-center items-center min-h-400]">
                    <Spinner size="lg"/>
                </div>
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
                                    {messages.map((message) => (
                                        <Table.Row key={message.identifier}>
                                            <Table.Cell>
                                                <Tooltip delay={0}>
                                                        <span
                                                            className="font-semibold truncate inline-block">
                                                            {truncate(message.identifier, IDENTIFIER_LENGTH)}
                                                        </span>
                                                    <Tooltip.Content showArrow>
                                                        <Tooltip.Arrow/>
                                                        <p>{message.identifier}</p>
                                                    </Tooltip.Content>
                                                </Tooltip>
                                            </Table.Cell>
                                            <Table.Cell>{truncate(message.as4Properties.conversationIdentifier, IDENTIFIER_LENGTH)}</Table.Cell>
                                            <Table.Cell>{message.businessDomainIdentifier}</Table.Cell>
                                            <Table.Cell>{truncate(message.backendMessageIdentifier, IDENTIFIER_LENGTH)}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.fromParty.identifier}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.toParty.identifier}</Table.Cell>
                                            <Table.Cell>{message.backendName}</Table.Cell>
                                            <Table.Cell>{message.gatewayName}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.service.name}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.action.name}</Table.Cell>
                                            <Table.Cell>
                                                <MessageDirectionChip
                                                    direction={message.direction}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <MessageDeliveryStatusChip isDelivered={message.delivered}/>
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(message.createdAt)}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <Tooltip delay={0}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="tertiary"
                                                            onPress={() => onDetailsClick(
                                                                message)}
                                                        >
                                                            <Eye/>
                                                        </Button>
                                                        <Tooltip.Content showArrow>
                                                            <Tooltip.Arrow/>
                                                            <p>Details</p>
                                                        </Tooltip.Content>
                                                    </Tooltip>

                                                    <Tooltip delay={0}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="tertiary"
                                                            onPress={() => onTransportStepsClick(
                                                                message)}
                                                        >
                                                            <Route/>
                                                        </Button>
                                                        <Tooltip.Content showArrow>
                                                            <Tooltip.Arrow/>
                                                            <p>Transport steps</p>
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
                </>
            )}

            <MessageDetailsView
                message={selectedMessage}
                state={detailsModal}
            />

            <MessageTransportStepsDetailView
                message={selectedMessage}
                state={transportModal}
            />

            <MessageReportingView state={reportModal}/>
        </div>
    )
}

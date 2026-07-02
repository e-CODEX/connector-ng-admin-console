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

import { useEffect, useState } from "react";
import { ConnectorMessage } from "@/types/message";
import { listMessages } from "@/services/message";
import { Button, Chip, Spinner, Table, toast, Tooltip, useOverlayState } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatDate, getDeliveryColor, getDeliveryLabel, truncate } from "@/utils";
import { PaginationControls } from "@/components/paging/pagination-controls";
import { MessageDetailsModal } from "@/components/message/message-details-modal";
import { MessageTransportStepsDetailModal } from "@/components/message/message-transport-steps-detail-modal";
import { PageHeader } from "@/components/common/page-hearder";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { MessageFilters } from "@/components/message/message-filters";

export default function MessagesAdminPage() {
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<ConnectorMessage[]>([])
    const [page, setPage] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [pageSize, setPageSize] = useState(20);
    const [selectedMessage, setSelectedMessage] = useState<ConnectorMessage | null>(null);
    const [identifierQuery, setIdentifierQuery] = useState("")
    const [backendNameQuery, setBackendNameQuery] = useState("")

    const debouncedIdentifier = useDebouncedValue(identifierQuery)
    const debouncedBackendName = useDebouncedValue(backendNameQuery)

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

    const onDetailsClick = (message: ConnectorMessage) => {
        setSelectedMessage(message);
        detailsModal.open();
    };

    const onTransportStepsClick = (message: ConnectorMessage) => {
        setSelectedMessage(message);
        transportModal.open();
    };

    useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true)
            try {
                const data = await listMessages({
                    page: page - 1,
                    size: pageSize,
                    identifier: debouncedIdentifier || undefined,
                    backendName: debouncedBackendName || undefined,
                })
                if (!active) return
                setMessages(data.content || [])
                setTotalElements(data.totalElements || 0)
            } catch (error) {
                if (!active) return
                toast("Error fetching messages")
                console.error("Error fetching messages:", error)
            } finally {
                if (active) setLoading(false)
            }
        })()

        return () => {
            active = false
        }
    }, [page, pageSize, debouncedIdentifier, debouncedBackendName])

    return (
        <>
            <PageHeader
                icon="gravity-ui:envelope"
                title="Business Messages"
                subtitle="Connector eDelivery inbox"
            />
            <MessageFilters
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
                                                            {truncate(message.identifier)}
                                                        </span>
                                                    <Tooltip.Content showArrow>
                                                        <Tooltip.Arrow/>
                                                        <p>{message.identifier}</p>
                                                    </Tooltip.Content>
                                                </Tooltip>
                                            </Table.Cell>
                                            <Table.Cell>{message.businessDomainIdentifier}</Table.Cell>
                                            <Table.Cell>{truncate(message.backendMessageIdentifier)}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.fromParty.identifier}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.toParty.identifier}</Table.Cell>
                                            <Table.Cell>{message.backendName}</Table.Cell>
                                            <Table.Cell>{message.gatewayName}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.service.name}</Table.Cell>
                                            <Table.Cell>{message.as4Properties.action.name}</Table.Cell>
                                            <Table.Cell>{message.direction}</Table.Cell>
                                            <Table.Cell>
                                                <Chip
                                                    color={getDeliveryColor(message.delivered)}
                                                    size="sm"
                                                    variant="soft"
                                                >
                                                    <Chip.Label>{getDeliveryLabel(message.delivered)}</Chip.Label>
                                                </Chip>
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

                                                    <Tooltip delay={0}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="tertiary"
                                                            onPress={() => onTransportStepsClick(
                                                                message)}
                                                        >
                                                            <Icon
                                                                className="size-4"
                                                                icon="boxicons:path"
                                                            />
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

            <MessageDetailsModal message={selectedMessage} state={detailsModal}/>
            <MessageTransportStepsDetailModal message={selectedMessage} state={transportModal}/>
        </>
    )
}

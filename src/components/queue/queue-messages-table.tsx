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

import type { Ref } from "react";
import React, { useEffect, useImperativeHandle } from "react";
import { Chip, Table } from "@heroui/react";
import { Inbox } from "lucide-react";
import type { ConnectorQueueMessage } from "@/types/response/queue";
import type { PaginatedResponse } from "@/types/response/paginated-response";
import type { PagedListParams } from "@/hooks/use-paged-list";
import { usePagedList } from "@/hooks/use-paged-list";
import { LoadErrorState } from "@/components/common/load-error-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { EmptyState } from "@/components/common/empty-state";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DateTime } from "@/components/common/date-time";
import { PaginationControls } from "@/components/paging/pagination-controls";

export interface QueueMessagesTableHandle {
    refresh: () => void;
}

interface QueueMessagesTableProps {
    ref?: Ref<QueueMessagesTableHandle>;
    onBusyChange?: (busy: boolean) => void;
    load: (params: PagedListParams) => Promise<PaginatedResponse<ConnectorQueueMessage>>;
    ariaLabel: string;
    emptyText: string;
    errorTitle: string;
    showFailureCause?: boolean;
}

export function QueueMessagesTable({ ref, onBusyChange, load, ariaLabel, emptyText, errorTitle, showFailureCause = false }: QueueMessagesTableProps) {
    const pagedList = usePagedList<ConnectorQueueMessage>(load);
    const busy = pagedList.loading || pagedList.refreshing;

    useImperativeHandle(ref, () => ({ refresh: pagedList.refresh }));

    useEffect(() => {
        onBusyChange?.(busy);
    }, [busy, onBusyChange]);

    if (pagedList.loadError) {
        return <LoadErrorState title={errorTitle} onRetry={pagedList.retry} className="py-8" />;
    }

    return (
        <div>
            <div aria-busy={pagedList.loading} className={`transition-opacity ${pagedList.loading && pagedList.items.length > 0 ? "pointer-events-none opacity-50" : ""}`}>
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label={ariaLabel}>
                            <Table.Header>
                                <Table.Column isRowHeader>Message ID</Table.Column>
                                <Table.Column>Timestamp</Table.Column>
                                <Table.Column>Correlation ID</Table.Column>
                                <Table.Column>Type</Table.Column>
                                <Table.Column>Redelivered</Table.Column>
                                <Table.Column>Delivery count</Table.Column>
                                {showFailureCause && <Table.Column>Failure cause</Table.Column>}
                            </Table.Header>
                            <Table.Body
                                renderEmptyState={() => (pagedList.loading ? <SpinnerView className="py-16" /> : <EmptyState icon={Inbox} text={emptyText} className="py-16" />)}
                            >
                                {pagedList.items.map((message) => (
                                    <Table.Row key={message.messageId}>
                                        <Table.Cell>
                                            <CopyableIdentifier identifier={message.messageId} visibleChars={15} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <DateTime value={message.timestamp} precision="second" />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <CopyableIdentifier identifier={message.correlationId} visibleChars={15} />
                                        </Table.Cell>
                                        <Table.Cell>{message.messageType}</Table.Cell>
                                        <Table.Cell>
                                            <Chip size="sm" variant="soft" color={message.redelivered ? "warning" : "default"}>
                                                <Chip.Label>{message.redelivered ? "Yes" : "No"}</Chip.Label>
                                            </Chip>
                                        </Table.Cell>
                                        <Table.Cell className="tabular-nums">{message.deliveryCount}</Table.Cell>
                                        {showFailureCause && (
                                            <Table.Cell>
                                                <span className="block max-w-80 truncate" title={message.failureCause}>
                                                    {message.failureCause}
                                                </span>
                                            </Table.Cell>
                                        )}
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </div>

            {pagedList.totalElements > 0 && (
                <div className="mt-4 flex justify-center">
                    <PaginationControls
                        page={pagedList.page}
                        pageSize={pagedList.pageSize}
                        totalElements={pagedList.totalElements}
                        onPageChange={pagedList.setPage}
                        onPageSizeChange={pagedList.setPageSize}
                    />
                </div>
            )}
        </div>
    );
}

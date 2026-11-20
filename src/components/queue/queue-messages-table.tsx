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
import React, { useEffect, useImperativeHandle, useState } from "react";
import type { Selection } from "@heroui/react";
import { Button, Checkbox, Chip, Table, useOverlayState } from "@heroui/react";
import { Inbox, RotateCcw } from "lucide-react";
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
import { ActionButton } from "@/components/common/action-button/action-button";
import { ConfirmModal } from "@/components/common/confirmation-modal";
import { toastError, toastErrorMessage, toastSuccess, toastWarning } from "@/utils";

const EMPTY_SELECTION: Selection = new Set();

export interface QueueMessagesTableHandle {
    refresh: () => void;
}

export interface QueueReplayOutcome {
    replayed: string[];
    notFound: string[];
    failed: string[];
}

export interface QueueMessagesReplay {
    targetLabel: string;
    replayMessage: (messageId: string) => Promise<void>;
    replayMessages: (messageIds: string[]) => Promise<QueueReplayOutcome>;
}

interface QueueMessagesTableProps {
    ref?: Ref<QueueMessagesTableHandle>;
    onBusyChange?: (busy: boolean) => void;
    load: (params: PagedListParams) => Promise<PaginatedResponse<ConnectorQueueMessage>>;
    ariaLabel: string;
    emptyText: string;
    errorTitle: string;
    showFailureCause?: boolean;
    replay?: QueueMessagesReplay;
}

type ReplayTarget = { kind: "single"; messageId: string } | { kind: "bulk"; messageIds: string[] };

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

function reportBulkReplay({ replayed, notFound, failed }: QueueReplayOutcome) {
    if (notFound.length === 0 && failed.length === 0) {
        toastSuccess(`${plural(replayed.length, "message")} sent back for processing.`);
        return;
    }

    const parts = [
        replayed.length > 0 && `${replayed.length} replayed`,
        notFound.length > 0 && `${notFound.length} no longer in the dead-letter queue`,
        failed.length > 0 && `${failed.length} failed (still selected, to retry)`,
    ].filter(Boolean);
    const summary = `${parts.join(", ")}.`;

    if (replayed.length === 0 && notFound.length === 0) {
        toastErrorMessage(`No message could be replayed: ${summary}`);
    } else {
        toastWarning(summary.charAt(0).toUpperCase() + summary.slice(1));
    }
}

export function QueueMessagesTable({ ref, onBusyChange, load, ariaLabel, emptyText, errorTitle, showFailureCause = false, replay }: QueueMessagesTableProps) {
    const pagedList = usePagedList<ConnectorQueueMessage>(load);
    const busy = pagedList.loading || pagedList.refreshing;

    const [selectedKeys, setSelectedKeys] = useState<Selection>(EMPTY_SELECTION);
    const [replayTarget, setReplayTarget] = useState<ReplayTarget | null>(null);
    const confirmReplay = useOverlayState();

    const selectedIds =
        selectedKeys === "all" ? pagedList.items.map((message) => message.messageId) : pagedList.items.map((message) => message.messageId).filter((id) => selectedKeys.has(id));

    useImperativeHandle(ref, () => ({ refresh: pagedList.refresh }));

    useEffect(() => {
        onBusyChange?.(busy);
    }, [busy, onBusyChange]);

    const changePage = (page: number) => {
        setSelectedKeys(EMPTY_SELECTION);
        pagedList.setPage(page);
    };

    const changePageSize = (size: number) => {
        setSelectedKeys(EMPTY_SELECTION);
        pagedList.setPageSize(size);
    };

    const askReplay = (target: ReplayTarget) => {
        setReplayTarget(target);
        confirmReplay.open();
    };

    const onReplayConfirmed = async () => {
        if (!replay || !replayTarget) return;

        try {
            if (replayTarget.kind === "single") {
                await replay.replayMessage(replayTarget.messageId);
                toastSuccess("The message was sent back for processing.");
                setSelectedKeys(EMPTY_SELECTION);
            } else {
                const outcome = await replay.replayMessages(replayTarget.messageIds);
                reportBulkReplay(outcome);
                // Keep only the failed ones selected, so "Replay selected" retries exactly those.
                setSelectedKeys(new Set(outcome.failed));
            }
            pagedList.refresh();
        } catch (error) {
            toastError(error, "The replay failed.");
        } finally {
            confirmReplay.close();
        }
    };

    if (pagedList.loadError) {
        return <LoadErrorState title={errorTitle} onRetry={pagedList.retry} className="py-8" />;
    }

    const replayCount = replayTarget?.kind === "bulk" ? replayTarget.messageIds.length : 1;

    return (
        <div>
            {replay && pagedList.items.length > 0 && (
                <div className="mb-3 flex min-h-10 flex-wrap items-center gap-3 rounded-lg bg-surface-secondary px-3 py-1.5">
                    <span className="text-sm text-muted" aria-live="polite">
                        {selectedIds.length > 0 ? `${plural(selectedIds.length, "message")} selected` : "Select messages to replay them together"}
                    </span>
                    {selectedIds.length > 0 && (
                        <div className="ml-auto flex items-center gap-2">
                            <Button size="sm" variant="tertiary" onPress={() => setSelectedKeys(EMPTY_SELECTION)}>
                                Clear
                            </Button>
                            <Button size="sm" variant="primary" onPress={() => askReplay({ kind: "bulk", messageIds: selectedIds })}>
                                <RotateCcw className="size-4" />
                                Replay selected
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div aria-busy={pagedList.loading} className={`transition-opacity ${pagedList.loading && pagedList.items.length > 0 ? "pointer-events-none opacity-50" : ""}`}>
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label={ariaLabel} selectionMode={replay ? "multiple" : "none"} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                            <Table.Header>
                                {replay ? (
                                    <Table.Column>
                                        <SelectionCheckbox label="Select all messages on this page" />
                                    </Table.Column>
                                ) : null}
                                <Table.Column isRowHeader>Message ID</Table.Column>
                                <Table.Column>Timestamp</Table.Column>
                                <Table.Column>Correlation ID</Table.Column>
                                <Table.Column>Type</Table.Column>
                                <Table.Column>Redelivered</Table.Column>
                                <Table.Column>Delivery count</Table.Column>
                                {showFailureCause ? <Table.Column>Failure cause</Table.Column> : null}
                                {replay ? <Table.Column>Actions</Table.Column> : null}
                            </Table.Header>
                            <Table.Body
                                renderEmptyState={() => (pagedList.loading ? <SpinnerView className="py-16" /> : <EmptyState icon={Inbox} text={emptyText} className="py-16" />)}
                            >
                                {pagedList.items.map((message) => (
                                    <Table.Row key={message.messageId} id={message.messageId}>
                                        {replay ? (
                                            <Table.Cell>
                                                <SelectionCheckbox label={`Select message ${message.messageId}`} />
                                            </Table.Cell>
                                        ) : null}
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
                                        {showFailureCause ? (
                                            <Table.Cell>
                                                <span className="block max-w-80 truncate" title={message.failureCause}>
                                                    {message.failureCause}
                                                </span>
                                            </Table.Cell>
                                        ) : null}
                                        {replay ? (
                                            <Table.Cell>
                                                <ActionButton label="Replay" icon={RotateCcw} onPress={() => askReplay({ kind: "single", messageId: message.messageId })} />
                                            </Table.Cell>
                                        ) : null}
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
                        onPageChange={changePage}
                        onPageSizeChange={changePageSize}
                    />
                </div>
            )}

            {replay && (
                <ConfirmModal
                    isDismissable={false}
                    state={confirmReplay}
                    title={replayCount === 1 ? "Replay message" : `Replay ${plural(replayCount, "message")}`}
                    message={
                        replayTarget?.kind === "single" ? (
                            <>
                                Message <span className="break-all font-mono">{replayTarget.messageId}</span> will be sent back to <strong>{replay.targetLabel}</strong> to be
                                processed again. Continue?
                            </>
                        ) : (
                            <>
                                {plural(replayCount, "message")} will be sent back to <strong>{replay.targetLabel}</strong> to be processed again. Continue?
                            </>
                        )
                    }
                    confirmLabel="Replay"
                    onConfirm={onReplayConfirmed}
                    onCancel={confirmReplay.close}
                />
            )}
        </div>
    );
}

function SelectionCheckbox({ label }: { label: string }) {
    return (
        <Checkbox slot="selection" aria-label={label}>
            <Checkbox.Content>
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
            </Checkbox.Content>
        </Checkbox>
    );
}

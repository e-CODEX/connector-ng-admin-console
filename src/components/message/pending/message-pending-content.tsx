/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { Selection} from "@heroui/react";
import { Button, Checkbox, Modal, Table } from "@heroui/react";
import React, { useState } from "react";
import { ArrowDownToLine, RefreshCw } from "lucide-react";
import { toastError, toastSuccess } from "@/utils";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useMessageService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DownloadActionButton } from "@/components/common/action-button/download-action-button";
import { PagedListView } from "@/components/paging/paged-list-view";
import { useList } from "@/hooks/use-list";

const EMPTY_SELECTION: Selection = new Set();

interface MessagePendingContentProps {
    onDownloaded?: () => void;
}

export function MessagePendingContent({ onDownloaded }: MessagePendingContentProps) {
    const messageService = useMessageService();
    const [downloading, setDownloading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(EMPTY_SELECTION);

    const list = useList<string>(async () => (await messageService.listPendingMessages()).messageIds, [messageService]);
    const { items: messageIds, loading, loadError } = list;

    const selectedIds = selectedKeys === "all"
        ? messageIds
        : messageIds.filter((id) => selectedKeys.has(id));

    const reload = () => {
        void list.refresh();
    };

    const onRefreshClicked = () => {
        setSelectedKeys(EMPTY_SELECTION);
        reload();
    };

    const onDownloadClicked = async (transportIdentifier: string) => {
        if (downloading) return;
        setDownloading(true);
        try {
            await messageService.downloadPendingMessage(transportIdentifier);
            setSelectedKeys(EMPTY_SELECTION);
            reload();
            toastSuccess(`Message related to transport ID [${transportIdentifier}] downloaded successfully.`);
            onDownloaded?.();
        } catch (error) {
            toastError(error);
        } finally {
            setDownloading(false);
        }
    };

    const onDownloadSelectedClicked = async () => {
        if (downloading || messageIds.length === 0) return;

        setDownloading(true);

        // Nothing selected: use the dedicated "download all" route
        if (selectedIds.length === 0) {
            try {
                await messageService.downloadAllPendingMessages();
                toastSuccess("All pending messages downloaded successfully.");
                setSelectedKeys(EMPTY_SELECTION);
                reload();
                onDownloaded?.();
            } catch (error) {
                toastError(error);
            } finally {
                setDownloading(false);
            }
            return;
        }

        const succeededIds: string[] = [];
        try {
            for (const id of selectedIds) {
                await messageService.downloadPendingMessage(id);
                succeededIds.push(id);
            }
            toastSuccess(`${succeededIds.length} message(s) downloaded successfully.`);
        } catch (error) {
            toastError(error);
            if (succeededIds.length > 0) {
                toastSuccess(`${succeededIds.length} of ${selectedIds.length} message(s) were downloaded before the error.`);
            }
        } finally {
            if (succeededIds.length > 0) {
                setSelectedKeys(new Set(selectedIds.filter((id) => !succeededIds.includes(id))));
                reload();
                onDownloaded?.();
            }
            setDownloading(false);
        }
    };

    return (
        <>
            <Modal.Body className="relative flex min-h-64 flex-1 flex-col">
                <PagedListView
                    list={{ ...list, retry: onRefreshClicked }}
                    errorMessage="Could not load pending messages"
                    placeholderClassName="min-h-64 flex-1"
                >
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content
                                aria-label="Pending messages"
                                selectionMode="multiple"
                                selectedKeys={selectedKeys}
                                onSelectionChange={setSelectedKeys}
                            >
                                <Table.Header>
                                    <Table.Column>
                                        <Checkbox slot="selection" aria-label="Select all">
                                            <Checkbox.Content>
                                                <Checkbox.Control>
                                                    <Checkbox.Indicator/>
                                                </Checkbox.Control>
                                            </Checkbox.Content>
                                        </Checkbox>
                                    </Table.Column>
                                    <Table.Column>#</Table.Column>
                                    <Table.Column isRowHeader>Message Transport Step Identifier</Table.Column>
                                    <Table.Column>Action.s</Table.Column>
                                </Table.Header>
                                <Table.Body
                                    renderEmptyState={() => <EmptyState text="No pending messages for pulling" className="py-16"/>}
                                >
                                    {messageIds.map((identifier, index) => (
                                        <Table.Row key={identifier} id={identifier}>
                                            <Table.Cell>
                                                <Checkbox variant="secondary" slot="selection" aria-label={`Select ${identifier}`}>
                                                    <Checkbox.Content>
                                                        <Checkbox.Control>
                                                            <Checkbox.Indicator/>
                                                        </Checkbox.Control>
                                                    </Checkbox.Content>
                                                </Checkbox>
                                            </Table.Cell>
                                            <Table.Cell>{index + 1}</Table.Cell>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={identifier} visibleChars={100}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <DownloadActionButton
                                                    isDisabled={downloading}
                                                    onPress={() => onDownloadClicked(identifier)}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </PagedListView>

                {downloading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                        <SpinnerView/>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                {!loadError && (
                    <Button
                        variant="secondary"
                        aria-label="Refresh pending messages"
                        isDisabled={loading || downloading}
                        onPress={onRefreshClicked}
                    >
                        <RefreshCw/>
                        Refresh
                    </Button>
                )}

                <Button
                    variant="primary"
                    aria-label="Download selected messages"
                    isDisabled={loading || downloading || loadError || messageIds.length === 0}
                    onPress={onDownloadSelectedClicked}
                >
                    <ArrowDownToLine/>
                    {selectedIds.length > 0 ? `Download Selected (${selectedIds.length})` : "Download All"}
                </Button>
            </Modal.Footer>
        </>
    );
}

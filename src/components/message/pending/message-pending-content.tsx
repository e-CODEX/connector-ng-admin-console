/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Button, Checkbox, Modal, Selection, Table } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { ArrowDownToLine, RefreshCw } from "lucide-react";
import { toastError, toastSuccess } from "@/utils";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useMessageService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DownloadActionButton } from "@/components/common/action-button/download-action-button";

const EMPTY_SELECTION: Selection = new Set();

interface MessagePendingContentProps {
    onDownloaded?: () => void;
}

export function MessagePendingContent({ onDownloaded }: MessagePendingContentProps) {
    const messageService = useMessageService();
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [messageIds, setMessageIds] = useState<string[]>([]);
    const [reloadToken, setReloadToken] = useState(0);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(EMPTY_SELECTION);

    // "all" is what the header checkbox produces, so normalise it to a list of ids
    const selectedIds = selectedKeys === "all"
        ? messageIds
        : messageIds.filter((id) => selectedKeys.has(id));

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await messageService.listPendingMessages();
                if (!cancelled) setMessageIds(data.messageIds);
            } catch (error) {
                if (!cancelled) toastError(error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [messageService, reloadToken]);

    const onRefreshClicked = () => {
        setSelectedKeys(EMPTY_SELECTION);
        setLoading(true);
        setReloadToken((token) => token + 1);
    };

    const onDownloadClicked = async (transportIdentifier: string) => {
        if (downloading) return;
        setDownloading(true);
        try {
            await messageService.downloadPendingMessage(transportIdentifier);
            setSelectedKeys(EMPTY_SELECTION);
            setReloadToken((token) => token + 1);
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
                setReloadToken((token) => token + 1);
                onDownloaded?.();
            } catch (error) {
                toastError(error);
            } finally {
                setDownloading(false);
            }
            return;
        }

        // Some messages selected: download them one by one
        let succeeded = 0;
        try {
            for (const id of selectedIds) {
                await messageService.downloadPendingMessage(id);
                succeeded++;
            }
            toastSuccess(`${succeeded} message(s) downloaded successfully.`);
        } catch (error) {
            toastError(error);
        } finally {
            if (succeeded > 0) {
                setSelectedKeys(EMPTY_SELECTION);
                setReloadToken((token) => token + 1);
                onDownloaded?.();
            }
            setDownloading(false);
        }
    };

    return (
        <>
            <Modal.Body className="relative flex min-h-64 flex-1 flex-col">
                {loading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <SpinnerView/>
                    </div>
                ) : (
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
                                    renderEmptyState={() => (
                                        <EmptyState text="No pending messages for download" className="py-10"/>
                                    )}
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
                )}

                {downloading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                        <SpinnerView/>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    aria-label="Refresh pending messages"
                    isDisabled={loading || downloading}
                    onPress={onRefreshClicked}
                >
                    <RefreshCw/>
                    Refresh
                </Button>

                <Button
                    variant="primary"
                    aria-label="Download selected messages"
                    isDisabled={loading || downloading || messageIds.length === 0}
                    onPress={onDownloadSelectedClicked}
                >
                    <ArrowDownToLine/>
                    {selectedIds.length > 0 ? `Download Selected (${selectedIds.length})` : "Download All"}
                </Button>
            </Modal.Footer>
        </>
    );
}

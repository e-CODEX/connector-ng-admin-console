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
import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { Button, Spinner, Table, Tooltip, useOverlayState } from "@heroui/react";
import { listAttachments } from "@/services/attachment";
import { formatBytes, formatDate, toastError, truncate } from "@/utils";
import { PaginationControls } from "@/components/paging/pagination-controls";
import { AttachmentDetailsView } from "@/components/attachment/attachment-details-view";
import { ArrowsRotateRight, Eye } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { AttachmentStorageChip } from "@/components/attachment/attachment-storage-chip";
import { Paperclip } from "lucide-react";

export default function AttachmentsAdminPage() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [attachments, setAttachments] = useState<ConnectorAttachmentResponse[]>([]);
    const [selectedAttachment, setSelectedAttachment] = useState<ConnectorAttachmentResponse | null>(null);
    const requestId = useRef(0);

    const detailsModal = useOverlayState();

    const onDetailsClick = (attachment: ConnectorAttachmentResponse) => {
        setSelectedAttachment(attachment);
        detailsModal.open();
    };

    const onRefreshClick = async () => {
        setRefreshing(true)
        try {
            await loadAttachments();
        } finally {
            setRefreshing(false);
        }
    }

    const loadAttachments = useCallback(async () => {
        const id = ++requestId.current;
        setLoading(true);
        try {
            const data = await listAttachments({
                page: page - 1,
                size: pageSize,
            });

            if (id !== requestId.current) {
                return;
            }

            setAttachments(data.content || []);
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
    }, [page, pageSize]);

    useEffect(() => {
        void loadAttachments();
    }, [loadAttachments]);

    return (
        <div>
            <PageHeader
                icon={Paperclip}
                title="Message attachments"
                subtitle="Attachments associated to messages"
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

            {loading ? (
                <div className="flex justify-center items-center min-h-400]">
                    <Spinner size="lg"/>
                </div>
            ) : (
                <>
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Connector messages attachments">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Name</Table.Column>
                                    <Table.Column>Content Type</Table.Column>
                                    <Table.Column>Description</Table.Column>
                                    <Table.Column>Size</Table.Column>
                                    <Table.Column>Storage</Table.Column>
                                    <Table.Column>Type</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Action.s</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {attachments.map((attachment) => (
                                        <Table.Row key={attachment.identifier}>
                                            <Table.Cell>
                                                <span
                                                    className="font-semibold truncate inline-block">
                                                    {truncate(attachment.identifier)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>{attachment.name}</Table.Cell>
                                            <Table.Cell>{attachment.contentType}</Table.Cell>
                                            <Table.Cell>{truncate(attachment.description)}</Table.Cell>
                                            <Table.Cell>{formatBytes(attachment.size)}</Table.Cell>
                                            <Table.Cell>
                                                <AttachmentStorageChip type={attachment.storage}/>
                                            </Table.Cell>
                                            <Table.Cell>{attachment.type}</Table.Cell>
                                            <Table.Cell>{formatDate(attachment.createdAt)}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <Tooltip delay={0}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="tertiary"
                                                            onPress={() => onDetailsClick(attachment)}
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

                    <AttachmentDetailsView attachment={selectedAttachment} state={detailsModal}/>
                </>
            )}
        </div>
    )
}

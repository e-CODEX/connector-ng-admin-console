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
import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { Table, useOverlayState } from "@heroui/react";
import { asFilter, formatBytes, saveFile, toastError, truncate } from "@/utils";
import { PaginationControls } from "@/components/paging/pagination-controls";
import { AttachmentDetailsView } from "@/components/attachment/attachment-details-view";
import { ArrowsRotateRight } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { AttachmentStorageChip } from "@/components/attachment/attachment-storage-chip";
import { Paperclip } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { usePagedList } from "@/hooks/use-paged-list";
import { DateTime } from "@/components/common/date-time";
import { useAttachmentService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DetailActionButton } from "@/components/common/action-button/detail-action-button";
import { DownloadActionButton } from "@/components/common/action-button/download-action-button";
import { MessageFiltersPanel } from "@/components/attachment/attachment-filters-panel";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { AttachmentTypesFilter } from "@/components/form/attachment-type-multi-selector";
import { ALL_SELECTOR } from "@/types/global";
import { AttachmentStoragesFilter } from "@/components/form/attachment-storage-multi-selector";

const asTypeFilter = (values: AttachmentTypesFilter[]) => values.length === 0 || values.includes(ALL_SELECTOR) ? undefined : values;
const asStorageFilter = (values: AttachmentStoragesFilter[]) => values.length === 0 || values.includes(ALL_SELECTOR) ? undefined : values;

export default function AttachmentsAdminPage() {
    const [selectedAttachment, setSelectedAttachment] = useState<ConnectorAttachmentResponse | null>(null);
    const [messageIdentifierQuery, setMessageIdentifierQuery] = useState("");
    const [filenameQuery, setFilenameQuery] = useState("");
    const [typesQuery, setTypesQuery] = useState({ types: [] as AttachmentTypesFilter[] });
    const [storagesQuery, setStoragesQuery] = useState({ storages: [] as AttachmentStoragesFilter[] });
    const debouncedMessageIdentifier = useDebouncedValue(messageIdentifierQuery);
    const debouncedFilename = useDebouncedValue(filenameQuery);

    const attachmentService = useAttachmentService();

    const pagedList = usePagedList<ConnectorAttachmentResponse>(
        ({ page, size }) =>
            attachmentService.listAttachments({
                page,
                size,
                messageIdentifier: asFilter(debouncedMessageIdentifier),
                name: asFilter(debouncedFilename),
                types: asTypeFilter(typesQuery.types),
                storages: asStorageFilter(storagesQuery.storages)
            }),
        [debouncedMessageIdentifier, debouncedFilename, typesQuery, storagesQuery],
    );

    const detailsModal = useOverlayState();

    const onMessageIdentifierChange = (value: string) => {
        setMessageIdentifierQuery(value);
        pagedList.setPage(1);
    };

    const onFilenameChange = (value: string) => {
        setFilenameQuery(value);
        pagedList.setPage(1);
    };

    const onTypesChange = (types: AttachmentTypesFilter[]) => {
        if (types.length === 0 || types.includes(ALL_SELECTOR)) {
            setTypesQuery({ types: [] });
        } else {
            setTypesQuery((prev) => ({ ...prev, storages: types }));
        }
    };

    const onStoragesChange = (types: AttachmentStoragesFilter[]) => {
        if (types.length === 0 || types.includes(ALL_SELECTOR)) {
            setStoragesQuery({ storages: [] });
        } else {
            setStoragesQuery((prev) => ({ ...prev, storages: types }));
        }
    };

    const onDetailsClick = (attachment: ConnectorAttachmentResponse) => {
        setSelectedAttachment(attachment);
        detailsModal.open();
    };

    const onDownloadClicked = async (attachment: ConnectorAttachmentResponse) => {
        try {
            const file = await attachmentService.downloadAttachment(attachment.identifier, attachment.name);
            saveFile(file);
        } catch (error) {
            toastError(error);
        }
    }

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
                    onPress={pagedList.refresh}
                    isDisabled={pagedList.refreshing}
                    isSpinning={pagedList.refreshing || pagedList.loading}
                />
            </PageHeader>

            <MessageFiltersPanel
                messageIdentifier={messageIdentifierQuery}
                filename={filenameQuery}
                types={typesQuery.types}
                storages={storagesQuery.storages}
                onMessageIdentifierChange={onMessageIdentifierChange}
                onFilenameChange={onFilenameChange}
                onTypesChange={onTypesChange}
                onStoragesChange={onStoragesChange}
            />

            {pagedList.loading ? (
                <SpinnerView className="mt-60"/>
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
                                    {pagedList.items.map((attachment) => (
                                        <Table.Row key={attachment.identifier}>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={attachment.identifier}/>
                                            </Table.Cell>
                                            <Table.Cell>{attachment.name}</Table.Cell>
                                            <Table.Cell>{attachment.contentType}</Table.Cell>
                                            <Table.Cell>{truncate(attachment.description)}</Table.Cell>
                                            <Table.Cell>{formatBytes(attachment.size)}</Table.Cell>
                                            <Table.Cell>
                                                <AttachmentStorageChip type={attachment.storage}/>
                                            </Table.Cell>
                                            <Table.Cell>{attachment.type}</Table.Cell>
                                            <Table.Cell>
                                                <DateTime value={attachment.createdAt} precision="second"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <DetailActionButton onPress={() => onDetailsClick(attachment)}/>
                                                    <DownloadActionButton onPress={() => onDownloadClicked(attachment)}/>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {pagedList.items.length === 0 && !pagedList.refreshing && (
                        <EmptyState text="No attachment available" className="mt-70"/>
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

                    <AttachmentDetailsView attachment={selectedAttachment} state={detailsModal}/>
                </>
            )}
        </div>
    )
}

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

import { PageHeader } from "@/components/common/header/page-header";
import React, { useState } from "react";
import type { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { Table, useOverlayState } from "@heroui/react";
import { asFilter, formatBytes, saveFile, toastError, truncate } from "@/utils";
import { PagedListView } from "@/components/paging/paged-list-view";
import { AttachmentDetailsView } from "@/components/attachment/attachment-details-view";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { AttachmentStorageChip } from "@/components/attachment/attachment-storage-chip";
import { Paperclip, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { usePagedList } from "@/hooks/use-paged-list";
import { DateTime } from "@/components/common/date-time";
import { useAttachmentService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DetailActionButton } from "@/components/common/action-button/detail-action-button";
import { DownloadActionButton } from "@/components/common/action-button/download-action-button";
import { MessageFiltersPanel } from "@/components/attachment/attachment-filters-panel";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { AttachmentTypesFilter } from "@/components/form/selector/attachment-type-multi-selector";
import { ALL_SELECTOR } from "@/types/global";
import type { AttachmentStoragesFilter } from "@/components/form/selector/attachment-storage-multi-selector";
import type { DateTimeRangeGranularity } from "@/components/form/selector/date-time-range-selector";
import type { RangeValue } from "react-aria-components";
import type { ZonedDateTime } from "@internationalized/date";
import { buildDefaultRange, isDefaultRange, toDateRange } from "@/types/period";
import { AttachmentStatusChip } from "@/components/attachment/attachment-status-chip";

const granularity: DateTimeRangeGranularity = "minute";

const asTypeFilter = (values: AttachmentTypesFilter[]) => values.length === 0 || values.includes(ALL_SELECTOR) ? undefined : values;
const asStorageFilter = (values: AttachmentStoragesFilter[]) => values.length === 0 || values.includes(ALL_SELECTOR) ? undefined : values;

export default function AttachmentsAdminPage() {
    const [selectedAttachment, setSelectedAttachment] = useState<ConnectorAttachmentResponse | null>(null);
    const [messageIdentifierQuery, setMessageIdentifierQuery] = useState("");
    const [filenameQuery, setFilenameQuery] = useState("");
    const [typesQuery, setTypesQuery] = useState({ types: [] as AttachmentTypesFilter[] });
    const [storagesQuery, setStoragesQuery] = useState({ storages: [] as AttachmentStoragesFilter[] });
    const [dateRange, setDateRange] = useState<RangeValue<ZonedDateTime> | null>(buildDefaultRange);
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
                storages: asStorageFilter(storagesQuery.storages),
                ...toDateRange(dateRange, granularity),
            }),
        [debouncedMessageIdentifier, debouncedFilename, typesQuery, storagesQuery, dateRange],
    );

    const useRefreshOnClose = (refresh: () => void) => {
        return useOverlayState({
            onOpenChange: (isOpen) => {
                if (!isOpen) refresh();
            },
        });
    }

    const detailsModal = useRefreshOnClose(pagedList.refresh);

    const hasCustomCriteria =
        messageIdentifierQuery !== "" ||
        filenameQuery !== "" ||
        typesQuery.types.length > 0 ||
        storagesQuery.storages.length > 0 ||
        !isDefaultRange(dateRange);

    const onClearCriteria = () => {
        setMessageIdentifierQuery("");
        setFilenameQuery("");
        setTypesQuery({ types: [] });
        setStoragesQuery({ storages: [] });
        setDateRange(buildDefaultRange());
        pagedList.setPage(1);
    };

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
            setTypesQuery((prev) => ({ ...prev, types }));
        }
        pagedList.setPage(1);
    };

    const onStoragesChange = (storages: AttachmentStoragesFilter[]) => {
        if (storages.length === 0 || storages.includes(ALL_SELECTOR)) {
            setStoragesQuery({ storages: [] });
        } else {
            setStoragesQuery((prev) => ({ ...prev, storages }));
        }
        pagedList.setPage(1);
    };

    const onDateRangeChange = (next: RangeValue<ZonedDateTime> | null) => {
        setDateRange(next);
        pagedList.setPage(1);
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
                    icon={RefreshCw}
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
                dateRange={dateRange}
                dateGranularity={granularity}
                onMessageIdentifierChange={onMessageIdentifierChange}
                onFilenameChange={onFilenameChange}
                onTypesChange={onTypesChange}
                onStoragesChange={onStoragesChange}
                onDateRangeChange={onDateRangeChange}
                onClear={onClearCriteria}
                canClear={hasCustomCriteria}
            />

            <PagedListView list={pagedList} errorMessage="Could not load attachments">
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Connector messages attachments">
                            <Table.Header>
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Name</Table.Column>
                                    <Table.Column>Content Type</Table.Column>
                                    <Table.Column>Description</Table.Column>
                                    <Table.Column>Size</Table.Column>
                                    <Table.Column>Storage</Table.Column>
                                    <Table.Column>Type</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Action.s</Table.Column>
                                </Table.Header>
                            </Table.Header>
                            <Table.Body
                                renderEmptyState={() => <EmptyState text="No attachment available" className="py-16"/>}
                            >
                                {pagedList.items.map((attachment) => (
                                    <Table.Row key={attachment.identifier}>
                                        <Table.Cell>
                                            <CopyableIdentifier identifier={attachment.identifier} visibleChars={15}/>
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
                                            <AttachmentStatusChip deletedAt={attachment.deletedAt} showDeletedAt/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <DateTime value={attachment.createdAt} precision="second"/>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center gap-1">
                                                <DetailActionButton onPress={() => onDetailsClick(attachment)}/>
                                                <DownloadActionButton
                                                    isDisabled={attachment.deletedAt !== null}
                                                    onPress={() => onDownloadClicked(attachment)}/>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </PagedListView>

            <AttachmentDetailsView attachment={selectedAttachment} state={detailsModal}/>
        </div>
    )
}

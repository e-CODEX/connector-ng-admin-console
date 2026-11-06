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

import path from "path";
import { PageHeader } from "@/components/common/header/page-header";
import React, { useState } from "react";
import { Table, useOverlayState } from "@heroui/react";
import { ConnectorProcessingMode } from "@/types/response/processing-mode";
import { saveFile, toastError, toastSuccess } from "@/utils";
import { ProcessingModeDetailsView } from "@/components/processing-mode/detail/processing-mode-detail-view";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { ProcessingModeCreationView } from "@/components/processing-mode/creation/processing-mode-creation-view";
import { Pen, Plus, RefreshCw, Workflow } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useList } from "@/hooks/use-list";
import { DateTime } from "@/components/common/date-time";
import { useProcessingModeService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DetailActionButton } from "@/components/common/action-button/detail-action-button";
import { DownloadActionButton } from "@/components/common/action-button/download-action-button";
import { ActionButton } from "@/components/common/action-button/action-button";
import { ProcessingModeEditTruststoreView } from "@/components/processing-mode/edit/processing-mode-edit-truststore-view";
import { LoadErrorState } from "@/components/common/load-error-state";

export default function ProcessingModesAdminPage() {
    const [selectedProcessingMode, setSelectedProcessingMode] = useState<ConnectorProcessingMode | null>(null);

    const detailsModal = useOverlayState();
    const addModal = useOverlayState();
    const updateTruststoreModal = useOverlayState();

    const processingModeService = useProcessingModeService();

    const list = useList<ConnectorProcessingMode>(processingModeService.listProcessingModes);

    const onAddClick = () => {
        addModal.open();
    }

    const onDetailsClick = (processingMode: ConnectorProcessingMode) => {
        setSelectedProcessingMode(processingMode);
        detailsModal.open();
    };

    const onUpdateTruststoreClick = (processingMode: ConnectorProcessingMode) => {
        setSelectedProcessingMode(processingMode);
        updateTruststoreModal.open();
    };

    const onDownloadClicked = async (pMode: ConnectorProcessingMode) => {
        try {
            const file = await processingModeService.downloadProcessingMode(pMode.uuid, path.basename(pMode.filename));
            saveFile(file);
        } catch (error) {
            toastError(error);
        }
    }

    return (
        <div>
            <PageHeader
                icon={Workflow}
                title="Processing Modes"
                subtitle="Stored processing modes"
            >
                <PageHeaderButton
                    variant="primary"
                    tooltip="Create a new processing mode"
                    icon={Plus}
                    onPress={onAddClick}
                />

                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={RefreshCw}
                    onPress={list.refresh}
                    isDisabled={list.refreshing}
                    isSpinning={list.refreshing || list.loading}
                />
            </PageHeader>

            {list.loading ? (
                <SpinnerView className="mt-60"/>
            ) : list.loadError ? (
                <LoadErrorState
                    title="Could not load processing modes"
                    onRetry={list.retry}
                />
            ) : (
                <>
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Connector processing modes">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Business domain</Table.Column>
                                    <Table.Column>Description</Table.Column>
                                    <Table.Column>Filename</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Action.s</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {list.items.map((pMode) => (
                                        <Table.Row key={pMode.uuid}>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={pMode.uuid}/>
                                            </Table.Cell>
                                            <Table.Cell>{pMode.businessDomainIdentifier}</Table.Cell>
                                            <Table.Cell>{pMode.description}</Table.Cell>
                                            <Table.Cell>{pMode.filename}</Table.Cell>
                                            <Table.Cell>
                                                <DateTime value={pMode.createdAt} precision="second"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <DetailActionButton onPress={() => onDetailsClick(pMode)}/>
                                                    <ActionButton
                                                        label="Edit truststore"
                                                        icon={Pen}
                                                        onPress={() => onUpdateTruststoreClick(pMode)}/>
                                                    <DownloadActionButton onPress={() => onDownloadClicked(pMode)}/>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {list.items.length === 0 && !list.refreshing && (
                        <EmptyState text="No processing mode available" className="mt-70"/>
                    )}

                    <ProcessingModeCreationView
                        state={addModal}
                        onSubmit={async (payload) => {
                            try {
                                await processingModeService.createProcessingMode(payload);
                                await list.refresh();
                                toastSuccess("Processing mode created successfully");
                                addModal.close();
                            } catch (error) {
                                toastError(error);
                            }
                        }}
                    />

                    <ProcessingModeEditTruststoreView
                        processingMode={selectedProcessingMode!}
                        state={updateTruststoreModal}
                        onSubmit={async (uuid, payload) => {
                            try {
                                await processingModeService.editTruststore(uuid, payload);
                                toastSuccess("Processing mode truststore updated successfully");
                                updateTruststoreModal.close();
                            } catch (error) {
                                toastError(error);
                            }
                        }}
                    />

                    <ProcessingModeDetailsView
                        processingMode={selectedProcessingMode}
                        state={detailsModal}
                    />
                </>
            )}
        </div>
    )
}

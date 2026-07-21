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

import { PageHeader } from "@/components/common/page-header";
import React, { useState } from "react";
import { Button, Table, Tooltip, useOverlayState } from "@heroui/react";
import { ConnectorProcessingModeResponse } from "@/types/response/processing-mode";
import { createProcessingMode, listProcessingModes } from "@/services/processing-mode";
import { formatDate, toastError, toastSuccess, truncate } from "@/utils";
import { ProcessingModeDetailsView } from "@/components/processing-mode/processing-mode-detail-view";
import { ArrowsRotateRight, Eye, Plus } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { ProcessingModeCreationView } from "@/components/processing-mode/processing-mode-creation-view";
import { Workflow } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useList } from "@/hooks/use-list";

export default function ProcessingModesAdminPage() {
    const [selectedProcessingMode, setSelectedProcessingMode] = useState<ConnectorProcessingModeResponse | null>(null);

    const detailsModal = useOverlayState();
    const addModal = useOverlayState();

    const list = useList<ConnectorProcessingModeResponse>(listProcessingModes);

    const onAddClick = () => {
        addModal.open();
    }

    const onDetailsClick = (processingMode: ConnectorProcessingModeResponse) => {
        setSelectedProcessingMode(processingMode);
        detailsModal.open();
    };

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
                    icon={ArrowsRotateRight}
                    onPress={list.refresh}
                    isDisabled={list.refreshing}
                    isSpinning={list.refreshing || list.loading}
                />
            </PageHeader>

            {list.loading ? (
                <SpinnerView className="mt-80"/>
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
                                                <span
                                                    className="font-semibold truncate inline-block">
                                                    {truncate(pMode.uuid)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>{pMode.businessDomainIdentifier}</Table.Cell>
                                            <Table.Cell>{pMode.description}</Table.Cell>
                                            <Table.Cell>{pMode.filename}</Table.Cell>
                                            <Table.Cell>{formatDate(pMode.createdAt)}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <Tooltip delay={0}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="tertiary"
                                                            onPress={() => onDetailsClick(pMode)}
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

                    {list.items.length === 0 && !list.refreshing && (
                        <EmptyState text="No processing mode available" className="mt-70"/>
                    )}

                    <ProcessingModeCreationView
                        state={addModal}
                        onSubmit={async (payload) => {
                            try {
                                await createProcessingMode(payload);
                                await list.refresh();
                                toastSuccess("Processing mode created successfully");
                                addModal.close();
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

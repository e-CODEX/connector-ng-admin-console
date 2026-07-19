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
import { useEffect, useRef, useState } from "react";
import { Button, Spinner, Table, Tooltip, useOverlayState } from "@heroui/react";
import { ConnectorProcessingModeResponse } from "@/types/response/processing-mode";
import { createProcessingMode, listProcessingModes } from "@/services/processing-mode";
import { formatDate, toastError, toastSuccess, truncate } from "@/utils";
import { Icon } from "@iconify/react";
import { ProcessingModeDetailsView } from "@/components/processing-mode/processing-mode-detail-view";
import { ArrowsRotateRight, Plus } from "@gravity-ui/icons";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { ProcessingModeCreationView } from "@/components/processing-mode/processing-mode-creation-view";

export default function ProcessingModesAdminPage() {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [processingModes, setProcessingModes] = useState<ConnectorProcessingModeResponse[]>([])
    const [selectedProcessingMode, setSelectedProcessingMode] = useState<ConnectorProcessingModeResponse | null>(null);
    const requestId = useRef(0);
    const detailsModal = useOverlayState();
    const addModal = useOverlayState();

    const onAddClick = () => {
        addModal.open();
    }

    const onRefreshClick = async () => {
        setRefreshing(true)
        try {
            await loadProcessingModes();
        } finally {
            setRefreshing(false);
        }
    }

    const onDetailsClick = (processingMode: ConnectorProcessingModeResponse) => {
        setSelectedProcessingMode(processingMode);
        detailsModal.open();
    };

    const loadProcessingModes = async () => {
        const id = ++requestId.current;
        setLoading(true)
        try {
            const data = await listProcessingModes()

            if (id !== requestId.current) {
                return;
            }

            setProcessingModes(data || [])
        } catch (error) {
            if (id !== requestId.current) {
                return;
            }

            toastError(error)
        } finally {
            if (id === requestId.current) {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        void loadProcessingModes()
    }, [])

    return (
        <div>
            <PageHeader
                icon="fluent-mdl2:processing"
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
                                    {processingModes.map((pMode) => (
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
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    <ProcessingModeCreationView
                        state={addModal}
                        onSubmit={async (payload) => {
                            try {
                                await createProcessingMode(payload);
                                await onRefreshClick();
                                toastSuccess("Processing mode created successfully");
                                addModal.close();
                            } catch (error) {
                                toastError(error)
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

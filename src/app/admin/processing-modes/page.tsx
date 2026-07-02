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

import { PageHeader } from "@/components/common/page-hearder";
import { useEffect, useState } from "react";
import { Button, Spinner, Table, toast, Tooltip, useOverlayState } from "@heroui/react";
import { ConnectorProcessingMode } from "@/types/processing-mode";
import { listProcessingModes } from "@/services/processing-mode";
import { formatDate, truncate } from "@/utils";
import { Icon } from "@iconify/react";
import {
    ProcessingModeDetailsModal
} from "@/components/processing-mode/processing-mode-detail-modal";

export default function ProcessingModesAdminPage() {
    const [loading, setLoading] = useState(true)
    const [processingModes, setProcessingModes] = useState<ConnectorProcessingMode[]>([])
    const [selectedProcessingMode, setSelectedProcessingMode] = useState<ConnectorProcessingMode | null>(
        null);

    const detailsModal = useOverlayState();

    const onDetailsClick = (processingMode: ConnectorProcessingMode) => {
        setSelectedProcessingMode(processingMode);
        detailsModal.open();
    };

    useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true)
            try {
                const data = await listProcessingModes()
                if (!active) return
                setProcessingModes(data || [])
            } catch (error) {
                if (!active) return
                toast("Error fetching processing mode")
                console.error("Error fetching processing mode:", error)
            } finally {
                if (active) setLoading(false)
            }
        })()

        return () => {
            active = false
        }
    }, [])

    return (
        <>
            <PageHeader
                icon="fluent-mdl2:processing"
                title="Processing Modes"
                subtitle="Stored processing modes"
            />

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

                    <ProcessingModeDetailsModal processingMode={selectedProcessingMode}
                                                state={detailsModal}/>
                </>
            )}
        </>
    )
}

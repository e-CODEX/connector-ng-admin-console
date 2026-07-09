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

import { Button, Chip, Modal, Spinner, Table, useOverlayState } from "@heroui/react";
import { formatDate, toastError } from "@/utils";
import React, { useEffect, useState } from "react";
import { Eye } from "@gravity-ui/icons";
import { ConnectorProcessingMode, ConnectorProcessingModeDetail } from "@/types/response/processing-mode";
import { DetailRow } from "@/components/common/detail-row";
import { getProcessingMode } from "@/services/processing-mode";
import { DetailSection } from "@/components/common/detail-section";

interface ProcessingModeDetailsViewProps {
    processingMode: ConnectorProcessingMode | null;
    state: ReturnType<typeof useOverlayState>;
}

export function ProcessingModeDetailsView({
                                              processingMode,
                                              state
                                          }: ProcessingModeDetailsViewProps) {
    const [details, setDetails] = useState<ConnectorProcessingModeDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isHomeLabel = (isHome: boolean) => {
        if (isHome) {
            return "Yes";
        } else {
            return "No";
        }
    }

    const isHomeColor = (isHome: boolean) => {
        if (isHome) {
            return "success";
        } else {
            return "danger";
        }
    }
    const identifier = processingMode?.uuid;

    useEffect(() => {
        if (!state.isOpen || !identifier) {
            return;
        }

        let active = true;

        (async () => {
            setLoading(true);
            setError(null);
            setDetails(null);
            try {
                const data = await getProcessingMode(identifier);
                if (!active) {
                    return;
                }

                setDetails(data);
            } catch (e) {
                if (!active) {
                    return;
                }

                toastError(e)
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [state.isOpen, identifier]);

    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-300">
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Eye className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Processing Mode Details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {processingMode && (
                                <div className="flex flex-col">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                        <DetailRow label="Identifier" value={processingMode.uuid}/>
                                        <DetailRow label="Business domain" value={processingMode.businessDomainIdentifier}/>
                                        <DetailRow label="Description" value={processingMode.description}/>
                                        <DetailRow label="Filename" value={processingMode.filename}/>
                                        <DetailRow label="Created at" value={formatDate(processingMode.createdAt)}/>
                                        <DetailRow label="Updated at" value={formatDate(processingMode.updatedAt)}/>
                                    </div>
                                    {loading ? (
                                        <div className="flex justify-center py-6">
                                            <Spinner size="sm"/>
                                        </div>
                                    ) : (
                                        <>
                                            {details && !loading && (
                                                <>
                                                    <DetailSection
                                                        title="Parties"
                                                        isEmpty={!details?.parties?.length}
                                                        emptyLabel="No parties available."
                                                    >
                                                        <Table>
                                                            <Table.ScrollContainer>
                                                                <Table.Content aria-label="Processing Mode parties">
                                                                    <Table.Header>
                                                                        <Table.Column isRowHeader>Identifier</Table.Column>
                                                                        <Table.Column>Identifier Type</Table.Column>
                                                                        <Table.Column>Name</Table.Column>
                                                                        <Table.Column>Role</Table.Column>
                                                                        <Table.Column>Role Type</Table.Column>
                                                                        <Table.Column>Is Home</Table.Column>
                                                                    </Table.Header>
                                                                    <Table.Body>
                                                                        {details.parties.map((party, i) => (
                                                                            <Table.Row key={`${party.identifier}-${i}`}>
                                                                                <Table.Cell>
                                                                            <span className="font-semibold truncate inline-block">
                                                                                {party.identifier}
                                                                            </span>
                                                                                </Table.Cell>
                                                                                <Table.Cell>{party.identifierType}</Table.Cell>
                                                                                <Table.Cell>{party.name}</Table.Cell>
                                                                                <Table.Cell>{party.role}</Table.Cell>
                                                                                <Table.Cell>{party.roleType}</Table.Cell>
                                                                                <Table.Cell>
                                                                                    <Chip color={isHomeColor(party.isHome)}
                                                                                          size="sm" variant="soft">
                                                                                        <Chip.Label>{isHomeLabel(party.isHome)}</Chip.Label>
                                                                                    </Chip>
                                                                                </Table.Cell>
                                                                            </Table.Row>
                                                                        ))}
                                                                    </Table.Body>
                                                                </Table.Content>
                                                            </Table.ScrollContainer>
                                                        </Table>
                                                    </DetailSection>

                                                    <DetailSection
                                                        title="Services"
                                                        isEmpty={!details?.services?.length}
                                                        emptyLabel="No services available."
                                                    >
                                                        <Table>
                                                            <Table.ScrollContainer>
                                                                <Table.Content aria-label="Processing Mode services">
                                                                    <Table.Header>
                                                                        <Table.Column isRowHeader>Name</Table.Column>
                                                                        <Table.Column>Type</Table.Column>
                                                                    </Table.Header>
                                                                    <Table.Body>
                                                                        {details.services.map((service, i) => (
                                                                            <Table.Row key={`${service.name}-${i}`}>
                                                                                <Table.Cell>
                                                                                    <span className="font-semibold truncate inline-block">
                                                                                        {service.name}
                                                                                    </span>
                                                                                </Table.Cell>
                                                                                <Table.Cell>{service.type}</Table.Cell>
                                                                            </Table.Row>
                                                                        ))}
                                                                    </Table.Body>
                                                                </Table.Content>
                                                            </Table.ScrollContainer>
                                                        </Table>
                                                    </DetailSection>

                                                    <DetailSection
                                                        title="Actions"
                                                        isEmpty={!details?.actions?.length}
                                                        emptyLabel="No actions available."
                                                    >
                                                        <Table>
                                                            <Table.ScrollContainer>
                                                                <Table.Content aria-label="Processing Mode actions">
                                                                    <Table.Header>
                                                                        <Table.Column isRowHeader>Name</Table.Column>
                                                                    </Table.Header>
                                                                    <Table.Body>
                                                                        {details.actions.map((action, i) => (
                                                                            <Table.Row key={`${action.name}-${i}`}>
                                                                                <Table.Cell>
                                                                                    <span className="font-medium inline-block">
                                                                                        {action.name}
                                                                                    </span>
                                                                                </Table.Cell>
                                                                            </Table.Row>
                                                                        ))}
                                                                    </Table.Body>
                                                                </Table.Content>
                                                            </Table.ScrollContainer>
                                                        </Table>
                                                    </DetailSection>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button slot="close" variant="tertiary">Close</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

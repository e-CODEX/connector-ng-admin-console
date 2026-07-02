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

import { Button, Chip, Modal, Table, useOverlayState } from "@heroui/react";
import { formatDate, getTransportDeliveryColor, getTransportDeliveryLabel, truncate } from "@/utils";
import React from "react";
import { ConnectorTransportStep } from "@/types/transport-step";
import { Eye } from "@gravity-ui/icons";
import { DetailRow } from "@/components/common/detail-row";
import { DetailSection } from "@/components/common/detail-section";

interface TransportStepDetailsModalProps {
    transportStep: ConnectorTransportStep | null;
    state: ReturnType<typeof useOverlayState>;
}

export function TransportStepDetailsModal({
                                              transportStep,
                                              state
                                          }: TransportStepDetailsModalProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-200">
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Eye className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Message details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {transportStep && (
                                <div className="flex flex-col">
                                    <div>
                                        <DetailRow label="Identifier" value={transportStep.identifier}/>
                                        <DetailRow label="Transported Message ID"
                                                   value={transportStep.transportedMessageIdentifier}/>
                                        <DetailRow label="Link Partner Name"
                                                   value={transportStep.linkPartnerName}/>
                                        <DetailRow label="Remote System Identifier"
                                                   value={transportStep.remoteSystemIdentifier}/>
                                        <DetailRow label="Message Type"
                                                   value={transportStep.messageType}/>
                                        <DetailRow label="Attempts" value={transportStep.numberOfAttempts}/>
                                        <DetailRow
                                            label="Status"
                                            value={
                                                <Chip
                                                    color={getTransportDeliveryColor(transportStep.status)}
                                                    size="sm" variant="soft">
                                                    <Chip.Label>{getTransportDeliveryLabel(transportStep.status)}</Chip.Label>
                                                </Chip>
                                            }
                                        />
                                        <DetailRow label="Created at"
                                                   value={formatDate(transportStep.createdAt)}/>
                                        <DetailRow label="Updated at"
                                                   value={formatDate(transportStep.updatedAt)}/>
                                    </div>
                                    <DetailSection title="Status history"
                                                   isEmpty={!transportStep.statuses?.length}
                                                   emptyLabel="No status history available.">
                                        <Table>
                                            <Table.ScrollContainer>
                                                <Table.Content aria-label="Transport step history">
                                                    <Table.Header>
                                                        <Table.Column isRowHeader>Status</Table.Column>
                                                        <Table.Column>Created at</Table.Column>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {transportStep.statuses.map((status, i) => (
                                                            <Table.Row key={`${status.status}-${i}`}>
                                                                <Table.Cell>
                                                                    <Chip
                                                                        color={getTransportDeliveryColor(transportStep.status)}
                                                                        size="sm" variant="soft">
                                                                        <Chip.Label>{getTransportDeliveryLabel(transportStep.status)}</Chip.Label>
                                                                    </Chip>
                                                                </Table.Cell>
                                                                <Table.Cell>{formatDate(status.createdAt)}</Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                    </Table.Body>
                                                </Table.Content>
                                            </Table.ScrollContainer>
                                        </Table>
                                    </DetailSection>
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

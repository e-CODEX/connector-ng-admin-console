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

import { Button, Chip, Modal, useOverlayState } from "@heroui/react";
import { formatDate, getTransportDeliveryColor, getTransportDeliveryLabel } from "@/utils";
import React from "react";
import { ConnectorTransportStep } from "@/types/transport-step";
import { Eye } from "@gravity-ui/icons";

interface TransportStepDetailsModalProps {
    transportStep: ConnectorTransportStep | null;
    state: ReturnType<typeof useOverlayState>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div
            className="flex justify-between gap-4 py-1.5 border-b border-separator last:border-b-0">
            <span className="font-semibold text-muted whitespace-nowrap">{label}</span>
            <span className="text-right break-all">{value}</span>
        </div>
    );
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
                                    <Row label="Identifier" value={transportStep.identifier}/>
                                    <Row label="Transported Message ID"
                                         value={transportStep.transportedMessageIdentifier}/>
                                    <Row label="Link Partner Name"
                                         value={transportStep.linkPartnerName}/>
                                    <Row label="Remote System Identifier"
                                         value={transportStep.remoteSystemIdentifier}/>
                                    <Row label="Message Type"
                                         value={transportStep.messageType}/>
                                    <Row label="Attempts" value={transportStep.numberOfAttempts}/>
                                    <Row
                                        label="Status"
                                        value={
                                            <Chip
                                                color={getTransportDeliveryColor(transportStep.status)}
                                                size="sm" variant="soft">
                                                <Chip.Label>{getTransportDeliveryLabel(transportStep.status)}</Chip.Label>
                                            </Chip>
                                        }
                                    />
                                    <Row
                                        label="Statuses"
                                        value={
                                            transportStep.statuses.map((status) => (
                                                <div key={status.status}>
                                                    <Chip
                                                        color={getTransportDeliveryColor(status.status)}
                                                        size="sm" variant="soft">
                                                        <Chip.Label>{getTransportDeliveryLabel(status.status)}</Chip.Label>
                                                    </Chip>
                                                    at <b>{formatDate(status.createdAt)}</b>
                                                </div>
                                            ))
                                        }
                                    />
                                    <Row label="Created at"
                                         value={formatDate(transportStep.createdAt)}/>
                                    <Row label="Updated at"
                                         value={formatDate(transportStep.updatedAt)}/>
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

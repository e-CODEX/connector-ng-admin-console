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
import { ConnectorMessage } from "@/types/message";
import { formatDate, getDeliveryColor, getDeliveryLabel } from "@/utils";
import React from "react";

interface MessageDetailsModalProps {
    message: ConnectorMessage | null;
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

export function MessageDetailsModal({ message, state }: MessageDetailsModalProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Heading>Message details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {message && (
                                <div className="flex flex-col">
                                    <Row label="Identifier" value={message.identifier}/>
                                    <Row label="Backend ID"
                                         value={message.backendMessageIdentifier}/>
                                    <Row label="Business domain"
                                         value={message.businessDomainIdentifier}/>
                                    <Row label="From"
                                         value={message.as4Properties.fromParty.identifier}/>
                                    <Row label="To"
                                         value={message.as4Properties.toParty.identifier}/>
                                    <Row label="Backend" value={message.backendName}/>
                                    <Row label="Gateway" value={message.gatewayName}/>
                                    <Row label="Service"
                                         value={message.as4Properties.service.name}/>
                                    <Row label="Action" value={message.as4Properties.action.name}/>
                                    <Row label="Direction" value={message.direction}/>
                                    <Row
                                        label="Status"
                                        value={
                                            <Chip color={getDeliveryColor(message.delivered)}
                                                  size="sm" variant="soft">
                                                <Chip.Label>{getDeliveryLabel(message.delivered)}</Chip.Label>
                                            </Chip>
                                        }
                                    />
                                    <Row label="Created at" value={formatDate(message.createdAt)}/>
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
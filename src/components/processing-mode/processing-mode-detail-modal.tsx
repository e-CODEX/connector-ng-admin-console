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

import { Button, Modal, useOverlayState } from "@heroui/react";
import { formatDate } from "@/utils";
import React from "react";
import { Eye } from "@gravity-ui/icons";
import { ConnectorProcessingMode } from "@/types/processing-mode";

interface ProcessingModeDetailsModalProps {
    processingMode: ConnectorProcessingMode | null;
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

export function ProcessingModeDetailsModal({
                                               processingMode,
                                               state
                                           }: ProcessingModeDetailsModalProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-200">
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Eye className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Processing Mode details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {processingMode && (
                                <div className="flex flex-col">
                                    <Row label="Identifier" value={processingMode.uuid}/>
                                    <Row label="Business domain"
                                         value={processingMode.businessDomainIdentifier}/>
                                    <Row label="Description"
                                         value={processingMode.description}/>
                                    <Row label="Filename"
                                         value={processingMode.filename}/>
                                    <Row label="Created at"
                                         value={formatDate(processingMode.createdAt)}/>
                                    <Row label="Updated at"
                                         value={formatDate(processingMode.updatedAt)}/>
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

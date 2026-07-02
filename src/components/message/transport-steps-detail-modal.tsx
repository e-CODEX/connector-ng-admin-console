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
import { ConnectorMessage } from "@/types/message";
import { Eye } from "@gravity-ui/icons";
import React from "react";

interface TransportStepsModalProps {
    message: ConnectorMessage | null;
    state: ReturnType<typeof useOverlayState>;
}

export function TransportStepsDetailModal({ message, state }: TransportStepsModalProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Eye className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Transport steps</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {message && (
                                <p>
                                    Transport steps for{" "}
                                    <span className="font-semibold">{message.identifier}</span>
                                    <br/>
                                    Not Yet Implemented
                                </p>
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

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

import { Modal, useOverlayState } from "@heroui/react";
import React from "react";
import { ConnectorTransportStepResponse } from "@/types/response/transport-step";
import { Eye } from "@gravity-ui/icons";
import { TransportStepDetails } from "@/components/transport-step/transport-step-details";

interface TransportStepDetailsViewProps {
    transportStep: ConnectorTransportStepResponse | null;
    state: ReturnType<typeof useOverlayState>;
}

export function TransportStepDetailsView({ transportStep, state }: TransportStepDetailsViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-200">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Eye className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Transport Step Details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {transportStep && <TransportStepDetails transportStep={transportStep}/>}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

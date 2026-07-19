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

import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { ConnectorMessage } from "@/types/response/message";
import { Eye } from "@gravity-ui/icons";
import React, { useEffect, useState } from "react";
import { ConnectorTransportStepResponse } from "@/types/response/transport-step";
import { getMessageTransportStep } from "@/services/message";
import { TransportStepDetails } from "@/components/transport-step/transport-step-details";
import { toastError } from "@/utils";

interface MessageTransportStepsDetailViewProps {
    message: ConnectorMessage | null;
    state: ReturnType<typeof useOverlayState>;
}

export function MessageTransportStepsDetailView({ message, state }: MessageTransportStepsDetailViewProps) {
    const [transportStep, setTransportStep] = useState<ConnectorTransportStepResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const identifier = message?.identifier;

    useEffect(() => {
        if (!state.isOpen || !identifier) return;

        let active = true;

        (async () => {
            setLoading(true);
            setError(null);
            setTransportStep(null);
            try {
                const data = await getMessageTransportStep(identifier);
                if (!active) return;
                setTransportStep(data);
            } catch (e) {
                if (!active) return;
                toastError(e)
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [state.isOpen, identifier]);

    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-200">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Eye className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Message Transport Steps Details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {loading ? (
                                <div className="flex justify-center py-6">
                                    <Spinner size="sm"/>
                                </div>
                            ) : (
                                <>
                                    {transportStep && <TransportStepDetails transportStep={transportStep}/>}
                                </>
                            )}
                            {error && (
                                <div className="flex justify-center py-6">
                                    <div className="text-destructive">{error}</div>
                                </div>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

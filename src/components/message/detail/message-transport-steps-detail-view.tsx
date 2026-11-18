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

import type { useOverlayState } from "@heroui/react";
import { Modal } from "@heroui/react";
import type { ConnectorMessage } from "@/types/response/message";
import React, { useEffect, useState } from "react";
import type { ConnectorTransportStep } from "@/types/response/transport-step";
import { TransportStepDetailsContent } from "@/components/transport-step/transport-step-details-content";
import { toastError } from "@/utils";
import { SpinnerView } from "@/components/common/spinner-view";
import { Route } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { useMessageService } from "@/hooks/use-http-service";

interface MessageTransportStepsDetailViewProps {
    message: ConnectorMessage | null;
    state: ReturnType<typeof useOverlayState>;
}

export function MessageTransportStepsDetailView({ message, state }: MessageTransportStepsDetailViewProps) {
    const [transportStep, setTransportStep] = useState<ConnectorTransportStep | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messageService = useMessageService();

    const identifier = message?.identifier;

    useEffect(() => {
        if (!state.isOpen || !identifier) return;

        let active = true;

        (async () => {
            setLoading(true);
            setError(null);
            setTransportStep(null);
            try {
                const data = await messageService.getMessageTransportStep(identifier);
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
    }, [state.isOpen, identifier, messageService]);

    return (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false}>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-200">
                    <Modal.CloseTrigger/>

                    <Modal.Header>
                        <ModalHeaderIcon icon={Route} tone="accent"/>
                        <Modal.Heading className="font-semibold">Message Transport Steps Details</Modal.Heading>
                    </Modal.Header>

                    <Modal.Body>
                        {loading ? (
                            <SpinnerView className="mt-60"/>
                        ) : (
                            <>
                                {transportStep && <TransportStepDetailsContent transportStep={transportStep}/>}
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
    );
}

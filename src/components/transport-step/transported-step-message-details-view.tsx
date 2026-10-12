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
import { ConnectorMessageDetailsResponse } from "@/types/response/message";
import { toastError } from "@/utils";
import React, { useEffect, useState } from "react";
import { SpinnerView } from "@/components/common/spinner-view";
import { MessageDetailsContent } from "@/components/message/detail/message-details-content";
import { Mail } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/modal-header-icon";
import { useTransportStepService } from "@/hooks/use-http-service";
import { ConnectorTransportStep } from "@/types/response/transport-step";

interface TransportedStepMessageDetailsViewProps {
    transportStep: ConnectorTransportStep | null;
    state: ReturnType<typeof useOverlayState>;
}

export function TransportedStepMessageDetailsView({ transportStep, state }: TransportedStepMessageDetailsViewProps) {
    const [details, setDetails] = useState<ConnectorMessageDetailsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const identifier = transportStep?.identifier;

    const transportStepService = useTransportStepService();
    const modalTitle = transportStep?.messageType == "BUSINESS"
        ? "Business Message Details" : "Evidence Message Details"

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
                const data = await transportStepService.retrieveTransportedMessage(identifier);

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
    }, [state.isOpen, identifier, transportStepService]);

    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-300">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <ModalHeaderIcon icon={Mail} tone="accent"/>
                            <Modal.Heading className="font-semibold">{modalTitle}</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {transportStep && (
                                <div className="flex flex-col">
                                    {loading ? (
                                        <SpinnerView className="mt-60"/>
                                    ) : (
                                        <MessageDetailsContent message={details} loading={loading}/>
                                    )}

                                    {error && (
                                        <div className="flex justify-center py-6">
                                            <div className="text-destructive">{error}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

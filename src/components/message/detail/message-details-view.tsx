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
import { ConnectorMessage, ConnectorMessageDetailsResponse } from "@/types/response/message";
import { toastError } from "@/utils";
import React, { useEffect, useState } from "react";
import { getMessage } from "@/services/message";
import { SpinnerView } from "@/components/common/spinner-view";
import { MessageDetailsContent } from "@/components/message/detail/message-details-content";
import { Mail } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/modal-header-icon";

interface MessageDetailsViewProps {
    message: ConnectorMessage | null;
    state: ReturnType<typeof useOverlayState>;
}

export function MessageDetailsView({ message, state }: MessageDetailsViewProps) {
    const [details, setDetails] = useState<ConnectorMessageDetailsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const identifier = message?.identifier;

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
                const data = await getMessage(identifier);

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
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-300">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <ModalHeaderIcon icon={Mail} tone="accent"/>
                            <Modal.Heading className="font-semibold">Message Details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {message && (
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

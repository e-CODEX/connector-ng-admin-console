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
import type { ConnectorMessage, ConnectorMessageDetailsResponse } from "@/types/response/message";
import React, { useEffect, useState } from "react";
import { SpinnerView } from "@/components/common/spinner-view";
import { MessageDetailsContent } from "@/components/message/detail/message-details-content";
import { Mail } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { useMessageService } from "@/hooks/use-http-service";
import { LoadErrorState } from "@/components/common/load-error-state";

interface MessageDetailsViewProps {
    message: ConnectorMessage | null;
    state: ReturnType<typeof useOverlayState>;
}

export function MessageDetailsView({ message, state }: MessageDetailsViewProps) {
    const [details, setDetails] = useState<ConnectorMessageDetailsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const identifier = message?.identifier;

    const messageService = useMessageService();

    useEffect(() => {
        if (!state.isOpen || !identifier) {
            return;
        }

        let active = true;

        (async () => {
            setLoading(true);
            setLoadFailed(false);
            setDetails(null);
            try {
                const data = await messageService.retrieveMessage(identifier);
                if (!active) return;
                setDetails(data);
            } catch {
                if (!active) return;
                setLoadFailed(true);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [state.isOpen, identifier, messageService, reloadToken]);

    const retry = () => setReloadToken((t) => t + 1);

    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false}>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-300">
                        <Modal.CloseTrigger/>

                        <Modal.Header>
                            <ModalHeaderIcon icon={Mail} tone="accent"/>
                            <Modal.Heading className="font-semibold">Business Message Details</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="flex flex-col">
                                {loading ? (
                                    <SpinnerView className="mt-60"/>
                                ) : loadFailed ? (
                                    <LoadErrorState
                                        className="min-h-100"
                                        title="Could not load message details"
                                        onRetry={retry}
                                    />
                                ) : (
                                    <MessageDetailsContent message={details} loading={loading}/>
                                )}
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

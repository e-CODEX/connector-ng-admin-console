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
import type { ConnectorMessageDetailsResponse } from "@/types/response/message";
import React, { useEffect, useState } from "react";
import { SpinnerView } from "@/components/common/spinner-view";
import { LoadErrorState } from "@/components/common/load-error-state";
import { MessageDetailsContent } from "@/components/message/detail/message-details-content";
import { Mail } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { useTransportStepService } from "@/hooks/use-http-service";
import type { ConnectorTransportStep } from "@/types/response/transport-step";

interface TransportedStepMessageDetailsViewProps {
    transportStep: ConnectorTransportStep | null;
    state: ReturnType<typeof useOverlayState>;
}

type LoadResult =
    | { key: string; data: ConnectorMessageDetailsResponse; failed?: false }
    | { key: string; data?: undefined; failed: true };

export function TransportedStepMessageDetailsView({ transportStep, state }: TransportedStepMessageDetailsViewProps) {
    const transportStepService = useTransportStepService();

    const [result, setResult] = useState<LoadResult | null>(null);
    const [reloadToken, setReloadToken] = useState(0);

    const identifier = transportStep?.identifier;
    const requestKey = identifier ? `${identifier}:${reloadToken}` : null;

    const isCurrent = !!requestKey && result?.key === requestKey;
    const loading = state.isOpen && !!requestKey && !isCurrent;
    const loadFailed = isCurrent && !!result?.failed;
    const details = isCurrent ? (result?.data ?? null) : null;

    const modalTitle =
              transportStep?.messageType === "BUSINESS" ? "Business Message Details" : "Evidence Message Details";

    useEffect(() => {
        if (!state.isOpen || !identifier || !requestKey) return;

        let active = true;

        transportStepService
            .retrieveTransportedMessage(identifier)
            .then((data) => {
                if (active) setResult({ key: requestKey, data });
            })
            .catch(() => {
                if (active) setResult({ key: requestKey, failed: true });
            });

        return () => {
            active = false;
            setResult(null);
        };
    }, [state.isOpen, identifier, requestKey, transportStepService]);

    const retry = () => setReloadToken((t) => t + 1);

    const renderBody = () => {
        if (loading) return <SpinnerView className="min-h-80"/>;
        if (loadFailed) {
            return (
                <LoadErrorState
                    className="min-h-80"
                    title="Could not load message details"
                    onRetry={retry}
                />
            );
        }
        return <MessageDetailsContent message={details} loading={loading}/>;
    };

    return (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false}>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-300">
                    <Modal.CloseTrigger/>

                    <Modal.Header>
                        <ModalHeaderIcon icon={Mail} tone="accent"/>
                        <Modal.Heading className="font-semibold">{modalTitle}</Modal.Heading>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="flex flex-col">{renderBody()}</div>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}

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

import { Button, Modal, Spinner, useOverlayState } from "@heroui/react";
import { saveFile, toastError } from "@/utils";
import React, { useEffect, useState } from "react";
import { ConnectorProcessingMode, ConnectorProcessingModeDetail } from "@/types/response/processing-mode";
import { ProcessingModeDetailsSection } from "@/components/processing-mode/detail/processing-mode-detail-section";
import { ArrowDownToLine, Workflow } from "lucide-react";
import { useProcessingModeService } from "@/hooks/use-http-service";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { SpinnerView } from "@/components/common/spinner-view";
import { LoadErrorState } from "@/components/common/load-error-state";

interface ProcessingModeDetailsViewProps {
    processingMode: ConnectorProcessingMode | null;
    state: ReturnType<typeof useOverlayState>;
}

type LoadResult =
    | { key: string; data: ConnectorProcessingModeDetail; failed?: false }
    | { key: string; data?: undefined; failed: true };

const basename = (p: string) => p.split(/[\\/]/).pop() ?? p;

export function ProcessingModeDetailsView({ processingMode, state }: ProcessingModeDetailsViewProps) {
    const processingModeService = useProcessingModeService();

    const [result, setResult] = useState<LoadResult | null>(null);
    const [reloadToken, setReloadToken] = useState(0);
    const [downloading, setDownloading] = useState(false);

    const identifier = processingMode?.uuid;
    const requestKey = identifier ? `${identifier}:${reloadToken}` : null;

    const isCurrent = !!requestKey && result?.key === requestKey;
    const loading = state.isOpen && !!requestKey && !isCurrent;
    const loadFailed = isCurrent && !!result?.failed;
    const details = isCurrent ? (result?.data ?? null) : null;

    useEffect(() => {
        if (!state.isOpen || !identifier || !requestKey) return;

        let active = true;

        processingModeService
            .retrieveProcessingMode(identifier)
            .then((data) => {
                if (active) setResult({ key: requestKey, data });
            })
            .catch(() => {
                if (active) setResult({ key: requestKey, failed: true });
            });

        return () => {
            active = false;
            setResult(null); // forces a fresh fetch on the next open
        };
    }, [state.isOpen, identifier, requestKey, processingModeService]);

    const retry = () => setReloadToken((t) => t + 1);

    const onDownloadClicked = async () => {
        if (!details || downloading) return;

        setDownloading(true);
        try {
            const file = await processingModeService.downloadProcessingMode(details.uuid, basename(details.filename));
            saveFile(file);
        } catch (error) {
            toastError(error);
        } finally {
            setDownloading(false);
        }
    };

    const renderBody = () => {
        if (loading) return <SpinnerView className="min-h-80"/>;
        if (loadFailed) {
            return (
                <LoadErrorState
                    className="min-h-80"
                    title="Could not load processing mode details"
                    onRetry={retry}
                />
            );
        }
        return <ProcessingModeDetailsSection processingMode={details} loading={loading} />;
    };

    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false}>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-300">
                        <Modal.CloseTrigger/>

                        <Modal.Header>
                            <ModalHeaderIcon icon={Workflow} tone="accent"/>
                            <Modal.Heading className="font-semibold">Processing Mode Details</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="flex flex-col">{renderBody()}</div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                className="w-full"
                                isPending={downloading}
                                isDisabled={loading || !details}
                                onPress={onDownloadClicked}
                            >
                                {({ isPending }) => (
                                    <>
                                        {isPending ? <Spinner color="current" size="sm"/> : <ArrowDownToLine className="size-4"/>}
                                        {isPending ? "Downloading…" : "Download"}
                                    </>
                                )}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

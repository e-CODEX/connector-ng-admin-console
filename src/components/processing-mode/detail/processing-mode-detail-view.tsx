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
import { saveFile, toastError } from "@/utils";
import React, { useEffect, useState } from "react";
import { ConnectorProcessingMode, ConnectorProcessingModeDetail } from "@/types/response/processing-mode";
import { ProcessingModeDetailsSection } from "@/components/processing-mode/detail/processing-mode-detail-section";
import { ArrowDownToLine, Workflow } from "lucide-react";
import { useProcessingModeService } from "@/hooks/use-http-service";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import path from "path";
import { SpinnerView } from "@/components/common/spinner-view";
import { LoadErrorState } from "@/components/common/load-error-state";

interface ProcessingModeDetailsViewProps {
    processingMode: ConnectorProcessingMode | null;
    state: ReturnType<typeof useOverlayState>;
}

export function ProcessingModeDetailsView({ processingMode, state }: ProcessingModeDetailsViewProps) {
    const [details, setDetails] = useState<ConnectorProcessingModeDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const processingModeService = useProcessingModeService();

    const identifier = processingMode?.uuid;

    const onDownloadClicked = async () => {
        if (!details) return;
        try {
            const file = await processingModeService.downloadProcessingMode(details.uuid, path.basename(details.filename));
            saveFile(file);
        } catch (error) {
            toastError(error);
        }
    };

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
                const data = await processingModeService.retrieveProcessingMode(identifier);
                if (!active) return;
                setDetails(data);
            } catch {
                if (!active) return;
                setLoadFailed(true);
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [state.isOpen, identifier, processingModeService, reloadToken]);

    const retry = () => setReloadToken((t) => t + 1);

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
                            <div className="flex flex-col">
                                {loading ? (
                                    <SpinnerView className="mt-60"/>
                                ) : loadFailed ? (
                                    <LoadErrorState
                                        className="min-h-80"
                                        title="Could not load processing mode details"
                                        onRetry={retry}
                                    />
                                ) : (
                                    <ProcessingModeDetailsSection processingMode={details} loading={loading}/>
                                )}
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                className="w-full"
                                isDisabled={loading || !details}
                                onPress={onDownloadClicked}
                            >
                                <ArrowDownToLine/>
                                Download
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

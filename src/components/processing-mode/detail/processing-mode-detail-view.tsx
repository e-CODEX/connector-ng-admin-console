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
import { toastError } from "@/utils";
import React, { useEffect, useState } from "react";
import { ConnectorProcessingModeDetail, ConnectorProcessingMode } from "@/types/response/processing-mode";
import { DetailRow } from "@/components/common/detail-row";
import { ProcessingModeDetailsSection } from "@/components/processing-mode/detail/processing-mode-detail-section";
import { Workflow } from "lucide-react";
import { DateTime } from "@/components/common/date-time";
import { useProcessingModeService } from "@/hooks/use-http-service";

interface ProcessingModeDetailsViewProps {
    processingMode: ConnectorProcessingMode | null;
    state: ReturnType<typeof useOverlayState>;
}

export function ProcessingModeDetailsView({ processingMode, state }: ProcessingModeDetailsViewProps) {
    const [details, setDetails] = useState<ConnectorProcessingModeDetail | null>(null);
    const [loading, setLoading] = useState(false);

    const processingModeService = useProcessingModeService();

    const identifier = processingMode?.uuid;

    useEffect(() => {
        if (!state.isOpen || !identifier) {
            return;
        }

        let active = true;

        (async () => {
            setLoading(true);
            setDetails(null);
            try {
                const data = await processingModeService.retrieveProcessingMode(identifier);
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
    }, [state.isOpen, identifier, processingModeService]);

    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-300">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Workflow className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Processing Mode Details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {processingMode && (
                                <div className="flex flex-col">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                        <DetailRow label="Identifier" value={processingMode.uuid}/>
                                        <DetailRow label="Business domain" value={processingMode.businessDomainIdentifier}/>
                                        <DetailRow label="Description" value={processingMode.description}/>
                                        <DetailRow label="Filename" value={processingMode.filename}/>
                                        <DetailRow label="Created at" value={<DateTime value={processingMode.createdAt} precision="second"/>}/>
                                        <DetailRow label="Updated at" value={<DateTime value={processingMode.updatedAt} precision="second"/>}/>
                                    </div>
                                    <ProcessingModeDetailsSection processingMode={details} loading={loading}/>
                                </div>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

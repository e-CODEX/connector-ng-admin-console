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
import React from "react";
import type { ConnectorProcessingMode } from "@/types/response/processing-mode";
import type { ProcessingModeEditTruststoreRequest } from "@/types/request/processing-mode";
import { ProcessingModeTruststoreEditionForm } from "@/components/processing-mode/edit/processing-mode-truststore-edition-form";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { Pen } from "lucide-react";

interface ProcessingModEditTruststoreViewProps {
    state: ReturnType<typeof useOverlayState>;
    processingMode: ConnectorProcessingMode
    onSubmit?: (uuid: string, request: ProcessingModeEditTruststoreRequest) => Promise<void> | void;
}

export function ProcessingModeEditTruststoreView({ processingMode, state, onSubmit }: ProcessingModEditTruststoreViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:min-w-250">
                        <Modal.CloseTrigger/>

                        <Modal.Header>
                            <ModalHeaderIcon icon={Pen} tone="accent"/>
                            <Modal.Heading className="font-semibold">Edit Processing Mode Truststore</Modal.Heading>
                        </Modal.Header>

                        <ProcessingModeTruststoreEditionForm
                            key={String(state.isOpen)}
                            onSubmit={onSubmit}
                            processingMode={processingMode}
                        />
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

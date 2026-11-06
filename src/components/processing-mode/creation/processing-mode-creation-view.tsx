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
import React from "react";
import { ProcessingModeCreationRequest } from "@/types/request/processing-mode";
import { ProcessingModeCreationForm } from "@/components/processing-mode/creation/processing-mode-creation-form";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { Plus } from "lucide-react";

interface ProcessingModeCreationViewProps {
    state: ReturnType<typeof useOverlayState>;
    onSubmit?: (request: ProcessingModeCreationRequest) => Promise<void> | void;
}

export function ProcessingModeCreationView({ state, onSubmit }: ProcessingModeCreationViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:min-w-200">
                        <Modal.CloseTrigger/>

                        <Modal.Header>
                            <ModalHeaderIcon icon={Plus} tone="accent"/>
                            <Modal.Heading className="font-semibold">Load A Processing Mode</Modal.Heading>
                        </Modal.Header>

                        <ProcessingModeCreationForm
                            key={String(state.isOpen)}
                            onSubmit={onSubmit}
                        />
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

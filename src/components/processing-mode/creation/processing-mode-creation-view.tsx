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
                        <ProcessingModeCreationForm
                            key={String(state.isOpen)}
                            onSubmit={onSubmit}
                            close={state.close}
                        />
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

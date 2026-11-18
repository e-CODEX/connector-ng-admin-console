/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ConnectorMessage } from "@/types/response/message";
import type { useOverlayState } from "@heroui/react";
import { Modal } from "@heroui/react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { MailCheck } from "lucide-react";
import React from "react";
import { MessageEvidenceTriggerModeForm } from "@/components/message/evidence-trigger/message-evidence-trigger-mode-form";
import type { SendEvidenceTriggerRequest } from "@/services/message";
import type { ConnectorEvidenceType } from "@/types/global";
import type { MessageEvidenceTriggerResponse } from "@/types/response/evidence-trigger";

interface MessageEvidenceTriggerModeViewProps {
    message: ConnectorMessage | null;
    evidenceType: ConnectorEvidenceType,
    onSubmit?: (triggerRequest: SendEvidenceTriggerRequest) => Promise<MessageEvidenceTriggerResponse | undefined>;
    state: ReturnType<typeof useOverlayState>;
}

export function MessageEvidenceTriggerModeView({ message, onSubmit, evidenceType, state }: MessageEvidenceTriggerModeViewProps) {
    return (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false}>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-130">
                    <Modal.CloseTrigger/>

                    <Modal.Header>
                        <ModalHeaderIcon icon={MailCheck} tone="accent"/>
                        <Modal.Heading className="font-semibold">Send Delivery Evidence</Modal.Heading>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="flex flex-col">
                            {message ? (
                                <MessageEvidenceTriggerModeForm message={message} evidenceType={evidenceType} onSubmit={onSubmit}/>
                            ) : (
                                <div className="flex justify-center py-6">
                                    <div className="text-destructive">Invalid message selected</div>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Modal, useOverlayState } from "@heroui/react";
import React from "react";
import { ChartPie, MailClock } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { MessagePendingContent } from "@/components/message/pending/message-pending-content";

interface MessagePendingViewProps {
    state: ReturnType<typeof useOverlayState>;
}

/**
 * Modal shell: owns nothing but the chrome.
 *
 * The stateful body is mounted only while the modal is open, so closing the
 * modal unmounts it and resets all of its state. That removes the need for a
 * reset-on-close effect (and the `react-hooks/set-state-in-effect` violation
 * that came with it).
 */
export function MessagePendingView({ state }: MessagePendingViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-200 sm:min-h-100">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <ModalHeaderIcon icon={MailClock} tone="accent"/>
                            <Modal.Heading className="font-semibold">Pending Messages</Modal.Heading>
                        </Modal.Header>
                        {state.isOpen && <MessagePendingContent/>}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}



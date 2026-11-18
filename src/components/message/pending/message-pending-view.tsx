/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { useOverlayState } from "@heroui/react";
import { Modal } from "@heroui/react";
import React from "react";
import { MailClock } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { MessagePendingContent } from "@/components/message/pending/message-pending-content";

interface MessagePendingViewProps {
    state: ReturnType<typeof useOverlayState>;
    onDownloaded?: () => void;
}

export function MessagePendingView({ state, onDownloaded }: MessagePendingViewProps) {
    return (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false} isKeyboardDismissDisabled>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-210 sm:min-h-100">
                    <Modal.CloseTrigger/>

                    <Modal.Header>
                        <ModalHeaderIcon icon={MailClock} tone="accent"/>
                        <Modal.Heading className="font-semibold">Pending Messages For Download</Modal.Heading>
                    </Modal.Header>

                    {state.isOpen && <MessagePendingContent onDownloaded={onDownloaded} />}
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}

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
import { MessageReportingContent } from "@/components/message/report/message-reporting-content";
import { ChartPie } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";

interface MessageReportingViewProps {
    state: ReturnType<typeof useOverlayState>;
}

export function MessageReportingView({ state }: MessageReportingViewProps) {
    return (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false} isKeyboardDismissDisabled>
            <Modal.Container>
                <Modal.Dialog className="sm:max-w-350 sm:min-h-200">
                    <Modal.CloseTrigger/>
                    <Modal.Header>
                        <ModalHeaderIcon icon={ChartPie} tone="accent"/>
                        <Modal.Heading className="font-semibold">Message Reporting</Modal.Heading>
                    </Modal.Header>
                    {state.isOpen && <MessageReportingContent/>}
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}



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
import { SquareBars } from "@gravity-ui/icons";
import { MessageReportingContent } from "@/components/message/report/message-reporting-content";

interface MessageReportingViewProps {
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
export function MessageReportingView({ state }: MessageReportingViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-350 sm:min-h-200">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <SquareBars className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Message Reporting</Modal.Heading>
                        </Modal.Header>
                        {state.isOpen && <MessageReportingContent/>}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}



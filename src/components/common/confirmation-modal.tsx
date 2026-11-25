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
import { Button, Modal, Spinner } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

type ButtonVariant = ComponentProps<typeof Button>["variant"];
type ModalSize = ComponentProps<typeof Modal.Container>["size"];

interface ConfirmModalProps {
    state: ReturnType<typeof useOverlayState>;
    message: ReactNode;
    title?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: ButtonVariant;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    size?: ModalSize;
    isDismissable?: boolean;
}

export function ConfirmModal({
                                 state,
                                 message,
                                 title = "Confirm",
                                 confirmLabel = "Confirm",
                                 cancelLabel = "Cancel",
                                 confirmVariant = "primary",
                                 onConfirm,
                                 onCancel,
                                 size = "sm",
                                 isDismissable = true,
                             }: ConfirmModalProps) {
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = async () => {
        setIsPending(true);
        try {
            await onConfirm();
        } finally {
            setIsPending(false);
        }
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <Modal.Backdrop
            isOpen={state.isOpen}
            onOpenChange={state.setOpen}
            isDismissable={isDismissable}
            isKeyboardDismissDisabled
        >
            <Modal.Container size={size}>
                <Modal.Dialog role="alertdialog">
                    <Modal.Header>
                        <Modal.Heading>{title}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>{message}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="tertiary" onPress={handleCancel} isDisabled={isPending}>
                            {cancelLabel}
                        </Button>
                        <Button variant={confirmVariant} onPress={handleConfirm} isPending={isPending}>
                            {({ isPending: pending }) => (
                                <>
                                    {pending && <Spinner color="current" size="sm" />}
                                    {confirmLabel}
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}

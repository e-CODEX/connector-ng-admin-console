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

import { Button, Form, Modal, Spinner, useOverlayState } from "@heroui/react";
import { ChangePasswordRequest } from "@/types/request/user";
import React, { useState } from "react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { Pen, Pencil } from "lucide-react";
import { changePasswordSchema } from "@/schemas/auth";
import { PasswordField } from "@/components/form/password-text-field";


const FORM_ID = "edit-user-password-form";

type FieldErrors = Partial<Record<keyof ChangePasswordRequest, string>>;

interface UserPasswordEditionFormProps {
    onSubmit?: (payload: ChangePasswordRequest) => Promise<void> | void;
    state: ReturnType<typeof useOverlayState>;
    close: () => void;
}

export function UserPasswordEditionForm({ onSubmit }: UserPasswordEditionFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};

            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof ChangePasswordRequest | undefined;
                if (key && !fieldErrors[key]) {
                    fieldErrors[key] = issue.message;
                }
            }

            setErrors(fieldErrors);
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit?.(result.data);
            resetForm();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Modal.CloseTrigger/>
            <Modal.Header>
                <ModalHeaderIcon icon={Pencil} tone="accent"/>
                <Modal.Heading className="font-semibold">Edit User Password</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
                <Form
                    id={FORM_ID}
                    onSubmit={handleSubmit}
                    validationBehavior="aria"
                    validationErrors={errors}
                    className="space-y-6"
                >
                    <PasswordField
                        label="Current password"
                        isRequired
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        isInvalid={!!errors.currentPassword}
                        errorMessage={errors.currentPassword}
                    />

                    <PasswordField
                        label="New password"
                        isRequired
                        value={newPassword}
                        onChange={setNewPassword}
                        isInvalid={!!errors.newPassword}
                        errorMessage={errors.newPassword}
                    />

                    <PasswordField
                        label="Confirm new password"
                        isRequired
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        isInvalid={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="submit"
                    form={FORM_ID}
                    className="w-full"
                    variant="primary"
                    isPending={submitting}
                    isDisabled={!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()}
                >
                    {submitting ? <Spinner color="current" size="sm"/> : <Pen className="mr-2 size-4"/>}
                    Change
                </Button>
            </Modal.Footer>
        </>
    )
}

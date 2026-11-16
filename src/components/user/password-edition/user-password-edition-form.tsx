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

import { Button, Form, Modal, Spinner } from "@heroui/react";
import type { ChangePasswordRequest } from "@/types/request/user";
import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { changePasswordSchema } from "@/schemas/auth";
import { PasswordField } from "@/components/form/password-text-field";

const FORM_ID = "edit-user-password-form";

type FieldErrors = Partial<Record<keyof ChangePasswordRequest, string>>;

interface UserPasswordEditionFormProps {
    onSubmit?: (payload: ChangePasswordRequest) => Promise<void> | void;
}

export function UserPasswordEditionForm({ onSubmit }: UserPasswordEditionFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const clearError = (...keys: (keyof ChangePasswordRequest)[]) =>
        setErrors((prev) => {
            if (!keys.some((k) => prev[k])) return prev;
            const next = { ...prev };
            keys.forEach((k) => delete next[k]);
            return next;
        });

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return; // Enter key can re-submit while pending

        const result = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof ChangePasswordRequest | undefined;
                if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setSubmitError(null);
        setSubmitting(true);

        try {
            await onSubmit?.(result.data);
            resetForm();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Could not change the password. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const canSubmit = !!currentPassword && !!newPassword && !!confirmPassword;

    return (
        <>
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
                        autoComplete="current-password"
                        isRequired
                        isDisabled={submitting}
                        value={currentPassword}
                        onChange={(v) => {
                            setCurrentPassword(v);
                            clearError("currentPassword");
                        }}
                        isInvalid={!!errors.currentPassword}
                        errorMessage={errors.currentPassword}
                    />

                    <PasswordField
                        label="New password"
                        autoComplete="new-password"
                        isRequired
                        isDisabled={submitting}
                        value={newPassword}
                        onChange={(v) => {
                            setNewPassword(v);
                            clearError("newPassword", "confirmPassword");
                        }}
                        isInvalid={!!errors.newPassword}
                        errorMessage={errors.newPassword}
                    />

                    <PasswordField
                        label="Confirm new password"
                        autoComplete="new-password"
                        isRequired
                        isDisabled={submitting}
                        value={confirmPassword}
                        onChange={(v) => {
                            setConfirmPassword(v);
                            clearError("confirmPassword");
                        }}
                        isInvalid={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword}
                    />

                    {submitError && (
                        <p role="alert" className="text-sm text-danger">{submitError}</p>
                    )}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form={FORM_ID}
                    className="w-full"
                    variant="primary"
                    isPending={submitting}
                    isDisabled={!canSubmit}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm"/> : <KeyRound className="size-4"/>}
                            {isPending ? "Changing…" : "Change"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </>
    );
}

"use client";

import React, { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { toastErrorMessage } from "@/utils";
import { ChangePasswordRequest } from "@/types/request/user";
import { changePasswordSchema } from "@/schemas/userAuth";

const FORM_ID = "change-password-form"
type FieldErrors = Partial<Record<keyof ChangePasswordRequest, string>>;

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});


    const handleSubmit = async (e: React.FormEvent) => {
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
        setLoading(true);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            if (res.ok) {
                window.location.assign("/login");
                return;
            }
            toastErrorMessage("Could not change password. Check your current password.");
        } catch {
            toastErrorMessage("Unable to reach the server.");
        } finally {
            setLoading(false);
        }
        setErrors({});
    };

    return (
        <div className="flex grow items-center justify-center">
            <div className="w-full max-w-sm px-4">
                <Form
                    id={FORM_ID}
                    onSubmit={handleSubmit}
                    validationBehavior="aria"
                    validationErrors={errors}
                    className="flex flex-col gap-4 max-w-sm mx-auto mt-24"
                >
                    <h1 className="text-xl font-semibold">Change your password</h1>
                    <p className="text-sm">You must set a new password before continuing.</p>

                    <TextField
                        isRequired
                        type="password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                    >
                        <Label>Current password</Label>
                        <Input/>
                        <FieldError>{errors.currentPassword}</FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                        isInvalid={!!errors.newPassword}
                    >
                        <Label>New password</Label>
                        <Input/>
                        <FieldError>{errors.newPassword}</FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        isInvalid={!!errors.confirmPassword}>
                        <Label>Confirm new password</Label>
                        <Input/>
                        <FieldError>{errors.confirmPassword}</FieldError>
                    </TextField>

                    <Button
                        type="submit"
                        form={FORM_ID}
                        isDisabled={loading}>Change password</Button>
                </Form>
            </div>
        </div>
    );
}
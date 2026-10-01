"use client";

import { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { toastErrorMessage } from "@/utils";

export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const tooShort = newPassword !== "" && newPassword.length < 12;
    const sameAsOld = newPassword !== "" && newPassword === currentPassword;
    const mismatch = confirm !== "" && confirm !== newPassword;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
    };

    return (
        <Form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-24">
            <h1 className="text-xl font-semibold">Change your password</h1>
            <p className="text-sm">You must set a new password before continuing.</p>

            <TextField isRequired type="password" value={currentPassword} onChange={setCurrentPassword}>
                <Label>Current password</Label>
                <Input/>
                <FieldError/>
            </TextField>

            <TextField
                isRequired
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                isInvalid={tooShort || sameAsOld}
            >
                <Label>New password</Label>
                <Input/>
                <FieldError>
                    {sameAsOld ? "New password must differ from the current one" : "At least 12 characters"}
                </FieldError>
            </TextField>

            <TextField isRequired type="password" value={confirm} onChange={setConfirm} isInvalid={mismatch}>
                <Label>Confirm new password</Label>
                <Input/>
                <FieldError>Passwords do not match</FieldError>
            </TextField>

            <Button type="submit" isDisabled={loading}>Change password</Button>
        </Form>
    );
}
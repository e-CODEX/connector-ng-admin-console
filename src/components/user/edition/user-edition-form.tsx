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

import { Button, FieldError, Form, Input, Label, Modal, Spinner, Switch, TextField } from "@heroui/react";
import type { UserEditionRequest } from "@/types/request/user";
import React, { useState } from "react";
import { Pen } from "lucide-react";
import { userEditionSchema } from "@/schemas/auth";
import type { ConnectorUser } from "@/types/response/user";
import { isAdmin } from "@/utils";

const FORM_ID = "edit-user-form";

type FieldErrors = Partial<Record<keyof UserEditionRequest, string>>;

interface UserEditionFormProps {
    onSubmit?: (payload: UserEditionRequest) => Promise<void> | void;
    user: ConnectorUser;
    isAdminContext?: boolean;
}

export function UserEditionForm({ onSubmit, user, isAdminContext = false }: UserEditionFormProps) {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email ?? "");
    const [enabled, setEnabled] = useState(user.enabled ?? true);

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const canEditPrivileged = !isAdmin(user) && isAdminContext;

    const isDirty =
              email !== (user.email ?? "") ||
              (canEditPrivileged && (username !== user.username || enabled !== (user.enabled ?? true)));

    const canSubmit = isDirty && !!email.trim() && (!canEditPrivileged || !!username.trim());

    const clearError = (key: keyof UserEditionRequest) =>
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return; // Enter key can re-submit while pending

        const result = userEditionSchema.safeParse({ username, email, enabled });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof UserEditionRequest | undefined;
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
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Could not update the user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

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
                    {canEditPrivileged && (
                        <TextField
                            autoFocus
                            isRequired
                            name="username"
                            isDisabled={submitting}
                            value={username}
                            onChange={(v) => { setUsername(v); clearError("username"); }}
                        >
                            <Label>Username</Label>
                            <Input placeholder="e.g. j.doe"/>
                            <FieldError>{errors.username}</FieldError>
                        </TextField>
                    )}

                    <TextField
                        autoFocus={!canEditPrivileged}
                        isRequired
                        name="email"
                        isDisabled={submitting}
                        value={email}
                        onChange={(v) => { setEmail(v); clearError("email"); }}
                    >
                        <Label>Email</Label>
                        <Input type="email" placeholder="e.g. j.doe@example.com"/>
                        <FieldError>{errors.email}</FieldError>
                    </TextField>

                    {canEditPrivileged && (
                        <Switch isSelected={enabled} onChange={setEnabled} isDisabled={submitting}>
                            <Switch.Content>
                                <Switch.Control>
                                    <Switch.Thumb/>
                                </Switch.Control>
                                Enabled
                            </Switch.Content>
                        </Switch>
                    )}

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
                            {isPending ? <Spinner color="current" size="sm"/> : <Pen className="size-4"/>}
                            {isPending ? "Saving…" : "Edit"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </>
    );
}

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
import type { UserCreationRequest } from "@/types/request/user";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { userCreationSchema } from "@/schemas/auth";
import { UserRoleSelector } from "@/components/form/selector/user-role-selector";
import { useUserRoles } from "@/hooks/use-user-roles";
import { PasswordField } from "@/components/form/password-text-field";
import type { USER_ROLE } from "@/types/global";

const FORM_ID = "add-user-form";
const DEFAULT_ROLES: USER_ROLE[] = ["ROLE_USER"];

type FieldErrors = Partial<Record<keyof UserCreationRequest, string>>;

interface UserCreationFormProps {
    onSubmit?: (payload: UserCreationRequest) => Promise<void> | void;
}

export function UserCreationForm({ onSubmit }: UserCreationFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [roles, setRoles] = useState<USER_ROLE[]>(DEFAULT_ROLES);

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { userRoles, isLoading, error } = useUserRoles();

    const clearError = (key: keyof UserCreationRequest) =>
        setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

    const resetForm = () => {
        setUsername("");
        setPassword("");
        setEmail("");
        setEnabled(true);
        setRoles(DEFAULT_ROLES);
        setErrors({});
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return; // Enter key can re-submit while pending

        const result = userCreationSchema.safeParse({ username, password, email, enabled, roles });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof UserCreationRequest | undefined;
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
            setSubmitError(err instanceof Error ? err.message : "Could not create the user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const canSubmit = !!username.trim() && !!email.trim() && !!password && roles.length > 0 && !isLoading;

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
                    <TextField
                        autoFocus
                        isRequired
                        name="username"
                        isDisabled={submitting}
                        value={username}
                        onChange={(v) => {
                            setUsername(v);
                            clearError("username");
                        }}
                    >
                        <Label>Username</Label>
                        <Input placeholder="e.g. j.doe"/>
                        <FieldError>{errors.username}</FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        name="email"
                        isDisabled={submitting}
                        value={email}
                        onChange={(v) => {
                            setEmail(v);
                            clearError("email");
                        }}
                    >
                        <Label>Email</Label>
                        <Input type="email" placeholder="e.g. j.doe@example.com"/>
                        <FieldError>{errors.email}</FieldError>
                    </TextField>

                    <PasswordField
                        label="Password"
                        placeholder="At least 12 characters"
                        isRequired
                        isDisabled={submitting}
                        value={password}
                        onChange={(v) => {
                            setPassword(v);
                            clearError("password");
                        }}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                    />

                    <UserRoleSelector
                        roles={userRoles ?? []}
                        isLoading={isLoading}
                        isDisabled={submitting}
                        loadError={!!error}
                        value={roles}
                        onValueChange={(v) => {
                            setRoles(v);
                            clearError("roles");
                        }}
                        isRequired
                        isInvalid={!!errors.roles}
                        errorMessage="Select at least one role"
                    />

                    <Switch isSelected={enabled} onChange={setEnabled} isDisabled={submitting}>
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb/>
                            </Switch.Control>
                            Enabled
                        </Switch.Content>
                    </Switch>

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
                            {isPending ? <Spinner color="current" size="sm"/> : <Plus className="size-4"/>}
                            {isPending ? "Adding…" : "Add"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </>
    );
}

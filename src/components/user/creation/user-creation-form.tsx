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

import { Button, FieldError, Form, Input, Label, Modal, Spinner, Switch, TextField, useOverlayState } from "@heroui/react";
import { UserCreationRequest } from "@/types/request/user";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { userCreationSchema } from "@/schemas/auth";
import { UserRoleSelector } from "@/components/form/selector/user-role-selector";
import { useUserRoles } from "@/hooks/use-user-roles";
import { PasswordField } from "@/components/form/password-text-field";
import { USER_ROLE } from "@/types/global";


const FORM_ID = "add-user-form";

type FieldErrors = Partial<Record<keyof UserCreationRequest, string>>;

interface UserCreationFormProps {
    onSubmit?: (payload: UserCreationRequest) => Promise<void> | void;
    state: ReturnType<typeof useOverlayState>;
    close: () => void;
}

export function UserCreationForm({ onSubmit }: UserCreationFormProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [enabled, setEnabled] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const { userRoles: userRoles, isLoading, error } = useUserRoles();
    const [roles, setRoles] = useState<USER_ROLE[]>(["ROLE_USER"]);

    const resetForm = () => {
        setUsername("");
        setPassword("");
        setEmail("");
        setEnabled(true);
        setRoles([]);
        setErrors({});
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = userCreationSchema.safeParse({
            username,
            password,
            email,
            enabled,
            roles,
        });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};

            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof UserCreationRequest | undefined;
                if (key && !fieldErrors[key]) {
                    fieldErrors[key] = issue.message;
                }
            }
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
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
                        value={username} onChange={setUsername}
                        isInvalid={!!errors.username}
                    >
                        <Label>Username</Label>
                        <Input placeholder="e.g. j.doe"/>
                        <FieldError>{errors.username}</FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        name="email"
                        value={email}
                        onChange={setEmail}
                        isInvalid={!!errors.email}
                    >
                        <Label>Email</Label>
                        <Input type="email" placeholder="e.g. j.doe@example.com"/>
                        <FieldError>{errors.email}</FieldError>
                    </TextField>

                    <PasswordField
                        label="Password"
                        placeholder="At least 12 characters"
                        isRequired
                        value={password}
                        onChange={(v) => {
                            setPassword(v);
                            setErrors((e) => ({ ...e, password: undefined }));
                        }}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                    />

                    <UserRoleSelector
                        roles={userRoles ?? []}
                        isLoading={isLoading}
                        loadError={!!error}
                        value={roles}
                        onValueChange={setRoles}
                        isRequired
                        isInvalid={!!errors.roles}
                        errorMessage="Select at least one role"
                    />

                    <Switch isSelected={enabled} onChange={setEnabled} defaultSelected>
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb/>
                            </Switch.Control>
                            Enabled
                        </Switch.Content>
                    </Switch>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form={FORM_ID}
                    className="w-full"
                    variant="primary"
                    isPending={submitting}
                    isDisabled={!username.trim() || !email.trim() || !password}
                >
                    {submitting ? <Spinner color="current" size="sm"/> : <Plus className="mr-2 size-4"/>}
                    Add
                </Button>
            </Modal.Footer>
        </>
    )
}

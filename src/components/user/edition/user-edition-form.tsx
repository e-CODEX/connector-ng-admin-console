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
import { UserCreationRequest, UserEditionRequest } from "@/types/request/user";
import React, { useState } from "react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { Pen, Pencil } from "lucide-react";
import { userEditionSchema } from "@/schemas/auth";
import { ConnectorUser } from "@/types/response/user";
import { isAdmin } from "@/utils";


const FORM_ID = "edit-user-form";

type FieldErrors = Partial<Record<keyof UserCreationRequest, string>>;

interface UserEditionFormProps {
    onSubmit?: (payload: UserEditionRequest) => Promise<void> | void;
    state: ReturnType<typeof useOverlayState>;
    user: ConnectorUser;
    isAdminContext: boolean;
    close: () => void;
}

export function UserEditionForm({ onSubmit, user, isAdminContext=false }: UserEditionFormProps) {
    const [username, setUsername] = useState<string>(user.username);
    const [enabled, setEnabled] = useState<boolean>(user.enabled ?? true);
    const [email, setEmail] = useState<string>(user.email ?? "");

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const userIsAdmin = isAdmin(user);

    const resetForm = () => {
        setUsername("");
        setEmail("");
        setEnabled(true);
        setErrors({});
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = userEditionSchema.safeParse({
            username,
            email,
            enabled,
        });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};

            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof UserEditionRequest | undefined;
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
            <Modal.CloseTrigger/>
            <Modal.Header>
                <ModalHeaderIcon icon={Pencil} tone="accent"/>
                <Modal.Heading className="font-semibold">Edit User</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
                <Form
                    id={FORM_ID}
                    onSubmit={handleSubmit}
                    validationBehavior="aria"
                    validationErrors={errors}
                    className="space-y-6"
                >
                    {!userIsAdmin && isAdminContext && (
                        <TextField
                            autoFocus
                            isRequired
                            name="username"
                            value={username}
                            onChange={setUsername}
                            isInvalid={!!errors.username}
                        >
                            <Label>Username</Label>
                            <Input placeholder="e.g. j.doe"/>
                            <FieldError>{errors.username}</FieldError>
                        </TextField>
                    )}

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

                    {!userIsAdmin && isAdminContext && (
                        <Switch isSelected={enabled} onChange={setEnabled} defaultSelected>
                            <Switch.Content>
                                <Switch.Control>
                                    <Switch.Thumb/>
                                </Switch.Control>
                                Enabled
                            </Switch.Content>
                        </Switch>
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
                    isDisabled={!username.trim() || !email.trim()}
                >
                    {submitting ? <Spinner color="current" size="sm"/> : <Pen className="mr-2 size-4"/>}
                    Edit
                </Button>
            </Modal.Footer>
        </>
    )
}

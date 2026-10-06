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
import React, { useEffect, useState } from "react";
import { ModalHeaderIcon } from "@/components/common/modal-header-icon";
import { Plus } from "lucide-react";
import { userCreationSchema } from "@/schemas/auth";

const FORM_ID = "add-user-form";

type FieldErrors = Partial<Record<keyof UserCreationRequest, string>>;

interface UserCreationViewProps {
    state: ReturnType<typeof useOverlayState>;
    onSubmit?: (domain: UserCreationRequest) => Promise<void> | void;
}

export function UserCreationView({ state, onSubmit }: UserCreationViewProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [enabled, setEnabled] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const resetForm = () => {
        setUsername("");
        setPassword("");
        setEmail("");
        setEnabled(true);
        setErrors({});
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = userCreationSchema.safeParse({
            username,
            password,
            email,
            enabled,
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

    // Reset when the modal closes
    useEffect(() => {
        (async () => {
            resetForm()
        })()
    }, [state.isOpen]);

    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-150">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <ModalHeaderIcon icon={Plus} tone="accent"/>
                            <Modal.Heading className="font-semibold">Create A User</Modal.Heading>
                        </Modal.Header>
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

                                <TextField
                                    isRequired
                                    name="password"
                                    value={password}
                                    onChange={(v) => {
                                        setPassword(v);
                                        setErrors((e) => ({ ...e, password: undefined }));
                                    }}
                                    isInvalid={!!errors.password}
                                >
                                    <Label>Password</Label>
                                    <Input type="password" placeholder="At least 8 characters"/>
                                    <FieldError>{errors.password}</FieldError>
                                </TextField>

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
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

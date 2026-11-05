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
import { UserCreationRequest, UserRoleEditionRequest } from "@/types/request/user";
import React, { useState } from "react";
import { Pen } from "lucide-react";
import { userRoleEditionSchema } from "@/schemas/auth";
import { ConnectorUser } from "@/types/response/user";
import { UserRoleSelector } from "@/components/form/selector/user-role-selector";
import { useUserRoles } from "@/hooks/use-user-roles";


const FORM_ID = "edit-user-roles-form";

type FieldErrors = Partial<Record<keyof UserCreationRequest, string>>;

interface UserRoleEditionFormProps {
    onSubmit?: (payload: UserRoleEditionRequest) => Promise<void> | void;
    state: ReturnType<typeof useOverlayState>;
    user: ConnectorUser;
    close: () => void;
}

export function UserRoleEditionForm({ onSubmit, user }: UserRoleEditionFormProps) {
    const [roles, setRoles] = useState<string[]>(user.roles || []);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const { userRoles: userRoles, isLoading, error } = useUserRoles();

    const resetForm = () => {
        setRoles([]);
        setErrors({});
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = userRoleEditionSchema.safeParse({
            roles
        });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};

            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof UserRoleEditionRequest | undefined;
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
                    <UserRoleSelector
                        roles={userRoles ?? []}
                        isLoading={isLoading}
                        loadError={!!error}
                        value={roles}
                        label="Roles"
                        onValueChange={setRoles}
                        isRequired
                        isInvalid={!!errors.roles}
                        errorMessage="Select at least one role"
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
                    isDisabled={userRoles.length === 0 || roles.length === 0}
                >
                    {submitting ? <Spinner color="current" size="sm"/> : <Pen className="mr-2 size-4"/>}
                    Edit
                </Button>
            </Modal.Footer>
        </>
    )
}

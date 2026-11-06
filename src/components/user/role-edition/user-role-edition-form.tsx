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
import { UserRoleEditionRequest } from "@/types/request/user";
import React, { useState } from "react";
import { Pen } from "lucide-react";
import { userRoleEditionSchema } from "@/schemas/auth";
import { ConnectorUser } from "@/types/response/user";
import { UserRoleSelector } from "@/components/form/selector/user-role-selector";
import { useUserRoles } from "@/hooks/use-user-roles";
import { USER_ROLE } from "@/types/global";

const FORM_ID = "edit-user-roles-form";

type FieldErrors = Partial<Record<keyof UserRoleEditionRequest, string>>;

interface UserRoleEditionFormProps {
    onSubmit?: (payload: UserRoleEditionRequest) => Promise<void> | void;
    user: ConnectorUser;
}

const sameRoles = (a: readonly string[], b: readonly string[]) =>
    a.length === b.length && a.every((r) => b.includes(r));

export function UserRoleEditionForm({ onSubmit, user }: UserRoleEditionFormProps) {
    const [roles, setRoles] = useState<USER_ROLE[]>((user.roles ?? []) as USER_ROLE[]);

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { userRoles, isLoading, error } = useUserRoles();

    const isDirty = !sameRoles(roles, user.roles ?? []);
    const canSubmit =
              !isLoading && !error && (userRoles?.length ?? 0) > 0 && roles.length > 0 && isDirty;

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return; // Enter key can re-submit while pending

        const result = userRoleEditionSchema.safeParse({ roles });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof UserRoleEditionRequest | undefined;
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
            setSubmitError(err instanceof Error ? err.message : "Could not update the roles. Please try again.");
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
                        isDisabled={submitting}
                        loadError={!!error}
                        value={roles}
                        label="Roles"
                        onValueChange={(v) => {
                            setRoles(v);
                            setErrors((prev) => (prev.roles ? { ...prev, roles: undefined } : prev));
                        }}
                        isRequired
                        isInvalid={!!errors.roles}
                        errorMessage="Select at least one role"
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
                            {isPending ? <Spinner color="current" size="sm"/> : <Pen className="size-4"/>}
                            {isPending ? "Saving…" : "Edit"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </>
    );
}

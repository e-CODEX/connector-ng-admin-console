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

import React, { useState } from "react";
import { toastError } from "@/utils";
import { Button, Description, Fieldset, Form, Modal, Spinner } from "@heroui/react";
import { FileSelectField } from "@/components/form/file-select-field";
import { toFieldErrors } from "@/schemas/processing-mode-creation";
import { ArrowUpToLine } from "lucide-react";
import { processingModeTruststoreEditionSchema, ProcessingModeTruststoreEditionValues } from "@/schemas/processing-mode-truststore-edition";
import { ConnectorProcessingMode } from "@/types/response/processing-mode";
import { ProcessingModeDetailHeaderSection } from "@/components/processing-mode/detail/processing-mode-detail-header-section";
import { ProcessingModeEditTruststoreRequest } from "@/types/request/processing-mode";
import { PasswordField } from "@/components/form/password-text-field";
import { ACCEPTED_TRUSTSTORES } from "@/types/global";

const FORM_ID = "edit-processing-mode-truststore-form";

type FieldErrors = Partial<Record<keyof ProcessingModeTruststoreEditionValues, string>>;

interface ProcessingModeTruststoreEditionFormProps {
    processingMode: ConnectorProcessingMode;
    onSubmit?: (uuid: string, request: ProcessingModeEditTruststoreRequest) => Promise<void> | void;
}

export function ProcessingModeTruststoreEditionForm({ onSubmit, processingMode }: ProcessingModeTruststoreEditionFormProps) {
    const [truststoreFile, setTruststoreFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const validateField = <K extends keyof ProcessingModeTruststoreEditionValues>(field: K, value: unknown) => {
        const result = processingModeTruststoreEditionSchema.shape[field].safeParse(value);

        setErrors((prev) => {
            if (result.success) {
                if (!(field in prev)) return prev;
                const next = { ...prev };
                delete next[field];
                return next;
            }

            const message = result.error.issues[0].message;
            return prev[field] === message ? prev : { ...prev, [field]: message };
        });
    };

    // Only re-validate fields that already show an error; the rest is validated on submit
    const revalidate = <K extends keyof ProcessingModeTruststoreEditionValues>(field: K, value: unknown) => {
        if (errors[field]) validateField(field, value);
    };

    const handleTruststoreFileSelect = (selected: File | null) => {
        setTruststoreFile(selected);
        revalidate("file", selected ?? undefined);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        revalidate("password", value);
    };

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return; // Enter key can re-submit while pending

        const result = processingModeTruststoreEditionSchema.safeParse({
            file: truststoreFile ?? undefined,
            password,
        });

        if (!result.success) {
            setErrors(toFieldErrors(result.error));
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            const values = result.data;
            await onSubmit?.(processingMode.uuid, {
                password: values.password,
                truststoreFile: values.file,
            });
        } catch (error) {
            toastError(error);
        } finally {
            setSubmitting(false);
        }
    };

    const canSubmit = !!truststoreFile && !!password;

    return (
        <>
            <Modal.Body>
                <Form
                    id={FORM_ID}
                    onSubmit={handleSubmit}
                    validationErrors={errors}
                    className="space-y-6"
                    validationBehavior="aria"
                >
                    <Fieldset className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                        <Fieldset.Legend>Processing mode info</Fieldset.Legend>

                        <Fieldset.Group className="space-y-4">
                            <ProcessingModeDetailHeaderSection processingMode={processingMode}/>
                        </Fieldset.Group>
                    </Fieldset>

                    <Fieldset className="rounded-xl border border-border bg-surface p-6 shadow-sm" disabled={submitting}>
                        <Fieldset.Legend>New truststore</Fieldset.Legend>
                        <Description>
                            Certificate store used to validate the ASiC container.
                        </Description>

                        <Fieldset.Group className="space-y-4">
                            <FileSelectField
                                label="Truststore file"
                                file={truststoreFile}
                                onFileChange={handleTruststoreFileSelect}
                                acceptedFileTypes={ACCEPTED_TRUSTSTORES}
                                buttonLabel="Choose truststore file ..."
                                error={errors.file}
                            />

                            <PasswordField
                                label="Password"
                                placeholder="Truststore password"
                                autoComplete="new-password"
                                isRequired
                                isDisabled={submitting}
                                value={password}
                                onChange={handlePasswordChange}
                                isInvalid={!!errors.password}
                                errorMessage={errors.password}
                            />
                        </Fieldset.Group>
                    </Fieldset>
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
                            {isPending ? <Spinner color="current" size="sm"/> : <ArrowUpToLine className="size-4"/>}
                            {isPending ? "Updating…" : "Update"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </>
    );
}

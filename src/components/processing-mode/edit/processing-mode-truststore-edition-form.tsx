/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ProcessingModeEditTruststoreRequest } from "@/types/request/processing-mode";
import React, { useState } from "react";
import { toastError } from "@/utils";
import { Button, Description, FieldError, Fieldset, Form, Input, Label, Modal, Spinner, TextField } from "@heroui/react";
import { FileSelectField } from "@/components/form/file-select-field";
import { toFieldErrors } from "@/schemas/processing-mode-creation";
import { ArrowUpToLine } from "lucide-react";
import { processingModeTruststoreEditionSchema, ProcessingModeTruststoreEditionValues } from "@/schemas/processing-mode-truststore-edition";
import { ConnectorProcessingMode } from "@/types/response/processing-mode";
import { ProcessingModeDetailHeaderSection } from "@/components/processing-mode/detail/processing-mode-detail-header-section";


interface ProcessingModeCreationFormProps {
    processingMode: ConnectorProcessingMode;
    onSubmit?: (uuid: string, request: ProcessingModeEditTruststoreRequest) => Promise<void> | void;
    close: () => void;
}

export function ProcessingModeTruststoreEditionForm({ onSubmit, processingMode }: ProcessingModeCreationFormProps) {
    const [truststoreFile, setTruststoreFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const validateField = <K extends keyof ProcessingModeTruststoreEditionValues>(field: K, value: unknown) => {
        const result = processingModeTruststoreEditionSchema.shape[field].safeParse(value);

        setErrors((prev) => {
            if (result.success) {
                if (!(field in prev)) {
                    return prev;
                }
                const next = { ...prev };
                delete next[field];
                return next;
            }

            const message = result.error.issues[0].message;

            if (prev[field] === message) {
                return prev;
            }

            return { ...prev, [field]: message };
        });
    };

    const handleTruststoreFileSelect = (selected: File | null) => {
        setTruststoreFile(selected);
        validateField("file", selected ?? undefined);
    };

    const handleTruststorePasswordChange = (value: string) => {
        setPassword(value);
        validateField("password", value);
    };

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const result = processingModeTruststoreEditionSchema.safeParse({
            file: truststoreFile ?? undefined,
            password: password,
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
                }
            );
        } catch (error) {
            toastError(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Modal.Body>
                <Form
                    id="add-processing-mode-form"
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

                    <Fieldset className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                        <Fieldset.Legend>New Truststore</Fieldset.Legend>
                        <Description>
                            Certificate store used to validate ASICS container.
                        </Description>

                        <Fieldset.Group className="space-y-4">
                            <FileSelectField
                                label="Truststore file"
                                file={truststoreFile}
                                onFileChange={handleTruststoreFileSelect}
                                acceptedFileTypes={[
                                    "application/x-pkcs12",
                                    "application/pkcs12",
                                    "application/octet-stream",
                                    "application/x-java-keystore",
                                    ".jks",
                                    ".keystore",
                                    ".p12",
                                    ".pfx",
                                ]}
                                buttonLabel="Choose truststore file ..."
                                error={errors.file}
                            />

                            <TextField
                                name="password"
                                value={password}
                                onChange={handleTruststorePasswordChange}
                                isRequired
                                isInvalid={!!errors.password}
                            >
                                <Label className="font-semibold">Password</Label>
                                <Input placeholder="Truststore password" type="password"/>
                                <FieldError>{errors.password}</FieldError>
                            </TextField>
                        </Fieldset.Group>
                    </Fieldset>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="add-processing-mode-form"
                    className="w-full"
                    variant="primary"
                    isPending={submitting}
                    isDisabled={submitting}
                >
                    {submitting ? (
                        <Spinner color="current" size="sm"/>
                    ) : (
                        <ArrowUpToLine className="mr-2 size-4"/>
                    )}
                    Update
                </Button>
            </Modal.Footer>
        </>
    );
}

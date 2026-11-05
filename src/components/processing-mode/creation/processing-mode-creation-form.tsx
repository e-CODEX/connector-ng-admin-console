/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ProcessingModeCreationRequest } from "@/types/request/processing-mode";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";
import React, { useState } from "react";
import { toastError } from "@/utils";
import { Button, Description, FieldError, Fieldset, Form, Input, Label, Modal, Spinner, TextField } from "@heroui/react";
import { BusinessDomainSelector } from "@/components/form/selector/business-domain-selector";
import { FileSelectField } from "@/components/form/file-select-field";
import { processingModeCreationSchema, ProcessingModeCreationValues, toFieldErrors } from "@/schemas/processing-mode-creation";
import { ArrowUpToLine } from "lucide-react";
import { ACCEPTED_XMLS } from "@/types/global";


interface ProcessingModeCreationFormProps {
    onSubmit?: (request: ProcessingModeCreationRequest) => Promise<void> | void;
    close: () => void;
}

export function ProcessingModeCreationForm({ onSubmit }: ProcessingModeCreationFormProps) {
    const businessDomainIdentifiers = useBusinessDomainIdentifiers();

    const [pmodeFile, setPmodeFile] = useState<File | null>(null);
    const [truststoreFile, setTruststoreFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [businessDomainIdentifier, setBusinessDomainIdentifier] = useState<string | undefined>(undefined);
    const [truststorePassword, setTruststorePassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const validateField = <K extends keyof ProcessingModeCreationValues>(field: K, value: unknown) => {
        const result = processingModeCreationSchema.shape[field].safeParse(value);

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

    const handlePmodeFileSelect = (selected: File | null) => {
        setPmodeFile(selected);
        validateField("pmodeFile", selected ?? undefined);
    };

    const handleTruststoreFileSelect = (selected: File | null) => {
        setTruststoreFile(selected);
        validateField("truststoreFile", selected ?? undefined);
    };

    const handleDomainChange = (identifier: string | null) => {
        setBusinessDomainIdentifier(identifier ?? undefined);
        validateField("businessDomainIdentifier", identifier ?? undefined);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        validateField("description", value);
    };

    const handleTruststorePasswordChange = (value: string) => {
        setTruststorePassword(value);
        validateField("truststorePassword", value);
    };

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const result = processingModeCreationSchema.safeParse({
            businessDomainIdentifier,
            description,
            pmodeFile: pmodeFile ?? undefined,
            truststoreFile: truststoreFile ?? undefined,
            truststorePassword,
        });

        if (!result.success) {
            setErrors(toFieldErrors(result.error));
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            const values = result.data;
            await onSubmit?.({
                businessDomainIdentifier: values.businessDomainIdentifier,
                description: values.description,
                processingModeFile: values.pmodeFile,
                truststore: {
                    password: values.truststorePassword,
                    truststoreFile: values.truststoreFile,
                },
            });
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
                        <Fieldset.Legend>Processing mode</Fieldset.Legend>
                        <Description>
                            The processing mode definition and the domain it applies to.
                        </Description>

                        <Fieldset.Group className="space-y-4">
                            <BusinessDomainSelector
                                name="businessDomainIdentifier"
                                identifiers={businessDomainIdentifiers}
                                value={businessDomainIdentifier}
                                onValueChange={handleDomainChange}
                                isRequired
                            />

                            <FileSelectField
                                label="Processing mode file"
                                file={pmodeFile}
                                onFileChange={handlePmodeFileSelect}
                                acceptedFileTypes={ACCEPTED_XMLS}
                                buttonLabel="Choose XML file ..."
                                error={errors.pmodeFile}
                            />

                            <TextField
                                name="description"
                                value={description}
                                onChange={handleDescriptionChange}
                                isRequired
                                isInvalid={!!errors.description}
                            >
                                <Label className="font-semibold">Description</Label>
                                <Input placeholder="e.g. default processing mode for domain"/>
                                <FieldError>{errors.description}</FieldError>
                            </TextField>
                        </Fieldset.Group>
                    </Fieldset>

                    <Fieldset className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                        <Fieldset.Legend>Truststore</Fieldset.Legend>
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
                                error={errors.truststoreFile}
                            />

                            <TextField
                                name="truststorePassword"
                                value={truststorePassword}
                                onChange={handleTruststorePasswordChange}
                                isRequired
                                isInvalid={!!errors.truststorePassword}
                            >
                                <Label className="font-semibold">Password</Label>
                                <Input placeholder="Truststore password" type="password"/>
                                <FieldError>{errors.truststorePassword}</FieldError>
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
                    Load
                </Button>
            </Modal.Footer>
        </>
    );
}

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

import type { ProcessingModeCreationRequest } from "@/types/request/processing-mode";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";
import React, { useState } from "react";
import { toastError } from "@/utils";
import { Button, Description, FieldError, Fieldset, Form, Input, Label, Modal, Spinner, TextField } from "@heroui/react";
import { BusinessDomainSelector } from "@/components/form/selector/business-domain-selector";
import { FileSelectField } from "@/components/form/file-select-field";
import { PasswordField } from "@/components/form/password-text-field";
import type { ProcessingModeCreationValues} from "@/schemas/processing-mode-creation";
import { processingModeCreationSchema, toFieldErrors } from "@/schemas/processing-mode-creation";
import { ArrowUpToLine } from "lucide-react";
import { ACCEPTED_TRUSTSTORES, ACCEPTED_XMLS } from "@/types/global";

const FORM_ID = "add-processing-mode-form";

type FieldErrors = Partial<Record<keyof ProcessingModeCreationValues, string>>;

interface ProcessingModeCreationFormProps {
    onSubmit?: (request: ProcessingModeCreationRequest) => Promise<void> | void;
}

export function ProcessingModeCreationForm({ onSubmit }: ProcessingModeCreationFormProps) {
    const businessDomainIdentifiers = useBusinessDomainIdentifiers();

    const [pmodeFile, setPmodeFile] = useState<File | null>(null);
    const [truststoreFile, setTruststoreFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [businessDomainIdentifier, setBusinessDomainIdentifier] = useState<string | undefined>(undefined);
    const [truststorePassword, setTruststorePassword] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const validateField = <K extends keyof ProcessingModeCreationValues>(field: K, value: unknown) => {
        const result = processingModeCreationSchema.shape[field].safeParse(value);

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
    const revalidate = <K extends keyof ProcessingModeCreationValues>(field: K, value: unknown) => {
        if (errors[field]) validateField(field, value);
    };

    const handlePmodeFileSelect = (selected: File | null) => {
        setPmodeFile(selected);
        revalidate("pmodeFile", selected ?? undefined);
    };

    const handleTruststoreFileSelect = (selected: File | null) => {
        setTruststoreFile(selected);
        revalidate("truststoreFile", selected ?? undefined);
    };

    const handleDomainChange = (identifier: string | null) => {
        setBusinessDomainIdentifier(identifier ?? undefined);
        revalidate("businessDomainIdentifier", identifier ?? undefined);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        revalidate("description", value);
    };

    const handleTruststorePasswordChange = (value: string) => {
        setTruststorePassword(value);
        revalidate("truststorePassword", value);
    };

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return; // Enter key can re-submit while pending

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

    const canSubmit =
              !!businessDomainIdentifier &&
              !!pmodeFile &&
              !!truststoreFile &&
              !!description.trim() &&
              !!truststorePassword;

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
                    <Fieldset className="rounded-xl border border-border bg-surface p-6 shadow-sm" disabled={submitting}>
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
                                isDisabled={submitting}
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
                                isDisabled={submitting}
                            >
                                <Label className="font-semibold">Description</Label>
                                <Input placeholder="e.g. default processing mode for domain"/>
                                <FieldError>{errors.description}</FieldError>
                            </TextField>
                        </Fieldset.Group>
                    </Fieldset>

                    <Fieldset className="rounded-xl border border-border bg-surface p-6 shadow-sm" disabled={submitting}>
                        <Fieldset.Legend>Truststore</Fieldset.Legend>
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
                                error={errors.truststoreFile}
                            />

                            <PasswordField
                                label="Password"
                                placeholder="Truststore password"
                                isRequired
                                isDisabled={submitting}
                                value={truststorePassword}
                                onChange={handleTruststorePasswordChange}
                                isInvalid={!!errors.truststorePassword}
                                errorMessage={errors.truststorePassword}
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
                            {isPending ? "Loading…" : "Load"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </>
    );
}

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

import type { useOverlayState } from "@heroui/react";
import { Button, FieldError, Form, Input, Label, ListBox, Modal, Select, Spinner, Switch, TextField } from "@heroui/react";
import React, { useState } from "react";
import type { BusinessDomainCreationRequest } from "@/types/request/business-domain";
import { Plus } from "lucide-react";

const FORM_ID = "add-business-domain-form";
const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const SOURCES = ["DATABASE"];
const DEFAULT_SOURCE = "DATABASE";

const validateIdentifier = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return "Identifier is required";
    if (!IDENTIFIER_PATTERN.test(trimmed)) {
        return "Use letters/numbers separated by a single '-' or '_' (e.g. my-default-domain).";
    }
    return null;
};

interface BusinessDomainCreationFormProps {
    state: ReturnType<typeof useOverlayState>;
    onSubmit?: (domain: BusinessDomainCreationRequest) => Promise<void> | void;
}

export function BusinessDomainCreationForm({ state, onSubmit }: BusinessDomainCreationFormProps) {
    const [identifier, setIdentifier] = useState("");
    const [description, setDescription] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [source, setSource] = useState<string>(DEFAULT_SOURCE);

    const [submitting, setSubmitting] = useState(false);
    const [identifierError, setIdentifierError] = useState<string | null>(null);
    const [identifierTouched, setIdentifierTouched] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const resetForm = () => {
        setIdentifier("");
        setDescription("");
        setEnabled(true);
        setSource(DEFAULT_SOURCE);
        setIdentifierError(null);
        setIdentifierTouched(false);
        setSubmitError(null);
    };

    const [wasOpen, setWasOpen] = useState(state.isOpen);

    if (state.isOpen !== wasOpen) {
        setWasOpen(state.isOpen);
        if (!state.isOpen) resetForm();
    }

    const handleIdentifierChange = (v: string) => {
        setIdentifier(v);
        if (identifierTouched) setIdentifierError(validateIdentifier(v));
    };

    const handleIdentifierBlur = () => {
        setIdentifierTouched(true);
        setIdentifierError(validateIdentifier(identifier));
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (submitting) {
            return;
        }

        const idError = validateIdentifier(identifier);
        setIdentifierError(idError);
        setIdentifierTouched(true);
        if (idError) return;

        setSubmitError(null);
        setSubmitting(true);

        try {
            await onSubmit?.({
                identifier: identifier.trim(),
                description: description.trim(),
                enabled,
                source,
            });
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Could not create the business domain. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const canSubmit = !!identifier.trim() && !!description.trim();

    return (
        <>
            <Modal.Body>
                <Form
                    id={FORM_ID}
                    onSubmit={handleSubmit}
                    validationBehavior="aria"
                    className="space-y-6"
                >
                    <TextField
                        autoFocus
                        isRequired
                        name="identifier"
                        isDisabled={submitting}
                        value={identifier}
                        onChange={handleIdentifierChange}
                        onBlur={handleIdentifierBlur}
                        isInvalid={!!identifierError}
                    >
                        <Label>Identifier</Label>
                        <Input placeholder="e.g. my-default-domain"/>
                        <FieldError>{identifierError}</FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        name="description"
                        isDisabled={submitting}
                        value={description}
                        onChange={setDescription}
                    >
                        <Label>Description</Label>
                        <Input placeholder="e.g. default business domain"/>
                    </TextField>

                    <Select
                        name="source"
                        isDisabled={submitting}
                        selectedKey={source}
                        onSelectionChange={(key) => key && setSource(String(key))}
                    >
                        <Label>Source</Label>
                        <Select.Trigger>
                            <Select.Value/>
                            <Select.Indicator/>
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {SOURCES.map((s) => (
                                    <ListBox.Item key={s} id={s} textValue={s}>
                                        {s}
                                        <ListBox.ItemIndicator/>
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>

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

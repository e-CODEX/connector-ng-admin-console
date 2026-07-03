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

import { Button, FieldError, Form, Input, Label, ListBox, Modal, Select, Spinner, TextField, useOverlayState } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Plus } from "@gravity-ui/icons";
import { ProcessingModeCreationRequest } from "@/types/request/processing-mode";
import { listBusinessDomains } from "@/services/business-domain";
import { FileTrigger } from "react-aria-components";

interface ProcessingModeAddModalProps {
    state: ReturnType<typeof useOverlayState>;
    onSubmit?: (domain: ProcessingModeCreationRequest) => Promise<void> | void;
}

export function ProcessingModeCreationModal({ state, onSubmit }: ProcessingModeAddModalProps) {
    const [file, setFile] = useState<File>(null as unknown as File);
    const [description, setDescription] = useState("");
    const [businessDomainIdentifier, setBusinessDomainIdentifier] = useState<string>("");
    const [businessDomainIdentifiers, setBusinessDomainIdentifiers] = useState<string[]>([]);

    const [fileError, setFileError] = useState("");
    const [domainError, setDomainError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const selected = files[0];
        if (!selected.name.toLowerCase().endsWith(".xml")) {
            setFileError("File must be a .xml processing mode definition");
            return;
        }
        setFile(selected);
        setFileError("");
    };

    const reset = () => {
        setFile(null as unknown as File);
        setDescription("");
        setBusinessDomainIdentifier("");
        setSubmitting(false);
    }
    // Reset when the modal closes
    useEffect(() => {
        (async () => {
            reset()
            const domains = await listBusinessDomains();
            setBusinessDomainIdentifiers(domains.map(d => d.identifier));
        })()
    }, [state.isOpen]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        let hasError = false;

        if (!file) {
            setFileError("A processing mode XML file is required");
            hasError = true;
        }

        if (!businessDomainIdentifier) {
            setDomainError("Select a business domain");
            hasError = true;
        }

        if (hasError) return;

        setSubmitting(true);
        try {
            await onSubmit?.({
                businessDomainIdentifier: businessDomainIdentifier.trim(),
                description: description.trim(), processingModeXmlFile: file
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-150">
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Plus className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Add Processing Mode</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <Form id="add-processing-mode-form" onSubmit={handleSubmit} className="space-y-6">
                                {/* processingModeXmlFile */}
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">Processing mode file</Label>
                                    <div className="flex items-center gap-3">
                                        <FileTrigger
                                            acceptedFileTypes={["application/xml", "text/xml", ".xml"]}
                                            onSelect={handleFileSelect}
                                        >
                                            <Button variant="secondary">Choose XML file…</Button>
                                        </FileTrigger>
                                        <span className="text-sm text-default-500">
                                            {file ? file.name : "No file selected"}
                                        </span>
                                    </div>
                                    {fileError && (
                                        <span className="text-sm text-danger">{fileError}</span>
                                    )}
                                </div>

                                <Select
                                    value={businessDomainIdentifier}
                                    onChange={(key) => {
                                        setBusinessDomainIdentifier(key as string);
                                        setDomainError("");
                                    }}
                                    isInvalid={!!domainError}
                                >
                                    <Label className="font-semibold">Business domain</Label>
                                    <Select.Trigger>
                                        <Select.Value/>
                                        <Select.Indicator/>
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox>
                                            {businessDomainIdentifiers.map((identifier) => (
                                                <ListBox.Item key={identifier} id={identifier} textValue={identifier}>
                                                    {identifier}
                                                    <ListBox.ItemIndicator/>
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                    <FieldError>{domainError}</FieldError>
                                </Select>

                                {/* metadata.description */}
                                <TextField
                                    value={description}
                                    onChange={setDescription}
                                >
                                    <Label className="font-semibold">Description</Label>
                                    <Input placeholder="e.g. default processing mode for domain X"/>
                                </TextField>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                type="submit"
                                form="add-processing-mode-form"
                                variant="primary"
                                isPending={submitting}
                                isDisabled={!file || !description.trim() || !businessDomainIdentifier}
                            >
                                {submitting ? <Spinner color="current" size="sm"/> : <Plus className="mr-2 size-4"/>}
                                Add
                            </Button>
                            <Button slot="close" variant="tertiary">Close</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

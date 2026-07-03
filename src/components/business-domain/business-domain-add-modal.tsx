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

import { Button, Form, Input, Label, ListBox, Modal, Select, Spinner, Switch, TextField, useOverlayState } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Plus } from "@gravity-ui/icons";
import { BusinessDomainCreationRequest } from "@/types/request/business-domain";

interface ProcessingModeAddModalProps {
    state: ReturnType<typeof useOverlayState>;
    onSubmit?: (domain: BusinessDomainCreationRequest) => Promise<void> | void;
}

const SOURCES = ["DATABASE"];

export function BusinessDomainAddModal({ state, onSubmit }: ProcessingModeAddModalProps) {
    const [identifier, setIdentifier] = useState("");
    const [description, setDescription] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [source, setSource] = useState<string>("DATABASE");
    const [submitting, setSubmitting] = useState(false);

    const reset = () => {
        setIdentifier("");
        setDescription("");
        setEnabled(true);
        setSource("DATABASE");
        setSubmitting(false);
    }
    // Reset when the modal closes
    useEffect(() => {
        (async () => {
            reset()
        })()
    }, [state.isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit?.({ identifier: identifier.trim(), description: description.trim(), enabled, source });
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
                            <Form id="add-business-domain-form" onSubmit={handleSubmit} className="space-y-6">
                                <TextField
                                    isRequired
                                    value={identifier}
                                    onChange={setIdentifier}
                                    autoFocus
                                >
                                    <Label>Identifier</Label>
                                    <Input placeholder="e.g. my-default-domain"/>
                                </TextField>

                                <TextField
                                    isRequired
                                    value={description}
                                    onChange={setDescription}
                                >
                                    <Label>Description</Label>
                                    <Input placeholder="e.g. default business domain"/>
                                </TextField>

                                <Select
                                    value={source}
                                    onChange={(key) => setSource(key as string)}
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
                                form="add-business-domain-form"
                                variant="primary"
                                isPending={submitting}
                                isDisabled={!identifier.trim() || !description.trim()}
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

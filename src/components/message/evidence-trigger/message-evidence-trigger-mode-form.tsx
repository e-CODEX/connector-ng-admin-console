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

import type { ConnectorMessage } from "@/types/response/message";
import { Button, Description, FieldError, Form, Label, Modal, Radio, RadioGroup, Spinner } from "@heroui/react";
import React, { useState } from "react";
import clsx from "clsx";
import { MailCheck } from "lucide-react";
import { messageEvidenceTriggerSchema } from "@/schemas/message";
import type { SendEvidenceTriggerRequest } from "@/services/message";
import type { ConnectorEvidenceType, OutboundMessageRequestMode } from "@/types/global";
import type { MessageEvidenceTriggerResponse } from "@/types/response/evidence-trigger";

interface MessageEvidenceTriggerModeFormProps {
    message: ConnectorMessage;
    evidenceType: ConnectorEvidenceType;
    onSubmit?: (triggerRequest: SendEvidenceTriggerRequest) => Promise<MessageEvidenceTriggerResponse | undefined>;
}

const FORM_ID = "trigger-message-evidence-form";

const DEFAULT_MODE: OutboundMessageRequestMode = "SOAP";

const SUBMISSION_MODES: ReadonlyArray<{
    mode: OutboundMessageRequestMode;
    description: string;
}> = [
    { mode: "SOAP", description: "Use the bff REST API" },
    { mode: "REST", description: "Use the connector REST API" },
];

type FieldErrors = Partial<Record<keyof SendEvidenceTriggerRequest, string>>;

const isSubmissionMode = (value: string): value is OutboundMessageRequestMode =>
    SUBMISSION_MODES.some((option) => option.mode === value);

export function MessageEvidenceTriggerModeForm({ message, evidenceType, onSubmit }: MessageEvidenceTriggerModeFormProps) {
    const [mode, setMode] = useState<OutboundMessageRequestMode>(DEFAULT_MODE);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleModeChange = (value: string) => {
        if (!isSubmissionMode(value)) return;
        setMode(value);
        setErrors((prev) => (prev.mode ? { ...prev, mode: undefined } : prev));
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (submitting) {
            return;
        }

        const result = messageEvidenceTriggerSchema.safeParse({
            payload: {
                referenceToMessageIdentifier: message.backendMessageIdentifier,
                evidenceType,
            },
            mode,
        });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof SendEvidenceTriggerRequest | undefined;
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
            setSubmitError(err instanceof Error ? err.message : "Could not send the evidence trigger. Please try again.");
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
                    className="space-y-6"
                >
                    <RadioGroup
                        name="mode"
                        variant="secondary"
                        value={mode}
                        onChange={handleModeChange}
                        isDisabled={submitting}
                        isInvalid={!!errors.mode}
                    >
                        <Label>Delivery method</Label>
                        <div className="grid gap-3 md:grid-cols-2">
                            {SUBMISSION_MODES.map((option) => (
                                <Radio key={option.mode} value={option.mode}>
                                    <Radio.Content
                                        className={clsx(
                                            "group relative flex w-full flex-col gap-6 rounded-xl border border-transparent bg-surface px-5 py-4 transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10",
                                            "data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10",
                                        )}
                                    >
                                        <Radio.Control className="absolute inset-e-4 top-3 size-5">
                                            <Radio.Indicator/>
                                        </Radio.Control>
                                        <div className="flex flex-col gap-1">
                                            <span>{option.mode}</span>
                                            <Description>{option.description}</Description>
                                        </div>
                                    </Radio.Content>
                                </Radio>
                            ))}
                        </div>
                        <FieldError>{errors.mode}</FieldError>
                    </RadioGroup>

                    {errors.payload && (
                        <p role="alert" className="text-sm text-danger">{errors.payload}</p>
                    )}
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
                    isDisabled={!message.backendMessageIdentifier}
                >
                    {({ isPending }) => (
                        <>
                            {isPending ? <Spinner color="current" size="sm"/> : <MailCheck className="size-4"/>}
                            {isPending ? "Sending…" : "Send"}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </>
    );
}

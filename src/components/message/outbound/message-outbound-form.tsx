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

import { Input, Label, TextField } from "@heroui/react";
import { SendMessageFormData } from "@/types/send-message-form";

interface MessageOutboundFormProps {
    data: SendMessageFormData;
    onChange: (next: SendMessageFormData) => void;
}

interface FormTextFieldProps {
    label: string;
    value: string;
    required?: boolean;
    onChange: (value: string) => void;
}

function FormTextField({
                           label,
                           value,
                           required,
                           onChange,
                       }: FormTextFieldProps) {
    return (
        <TextField
            value={value ?? ""}
            onChange={onChange}
            isRequired={required}
            className="w-full"
        >
            <Label className="text-sm font-semibold text-default-700">{label}</Label>
            <Input/>
        </TextField>
    );
}

export function MessageOutboundForm({
                                        data,
                                        onChange,
                                    }: MessageOutboundFormProps) {
    const { as4Properties } = data;

    const update = (patch: Partial<SendMessageFormData>) => {
        onChange({ ...data, ...patch, });
    };

    const updateAs4 = (patch: Partial<SendMessageFormData["as4Properties"]>) => {
        update({
            as4Properties: {
                ...data.as4Properties,
                ...patch,
            },
        });
    };

    return (
        <section className="rounded-lg border border-separator bg-content1 p-2">
            <h2 className="mb-2 text-lg font-semibold">Message configuration</h2>

            <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <FormTextField
                        label="Conversation Id"
                        value={as4Properties.conversationIdentifier}
                        onChange={(value) => updateAs4({ conversationIdentifier: value })}
                    />

                    <FormTextField
                        label="Backend Message Id"
                        value={data.backendMessageIdentifier}
                        onChange={(value) => update({ backendMessageIdentifier: value })}
                    />

                    <FormTextField
                        label="Ebms Message Id"
                        value={as4Properties.ebmsMessageIdentifier}
                        onChange={(value) => updateAs4({ ebmsMessageIdentifier: value })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <FormTextField
                        label="Backend Name"
                        value={data.backendName}
                        required
                        onChange={(value) => update({ backendName: value })}
                    />
                    <FormTextField
                        label="Original Sender"
                        value={as4Properties.originalSender}
                        required
                        onChange={(value) => updateAs4({ originalSender: value })}
                    />

                    <FormTextField
                        label="Final Recipient"
                        value={as4Properties.finalRecipient}
                        required
                        onChange={(value) => updateAs4({ finalRecipient: value })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <FormTextField
                        label="Service"
                        value={as4Properties.service.name}
                        required
                        onChange={(value) =>
                            updateAs4({
                                service: {
                                    ...as4Properties.service,
                                    name: value,
                                },
                            })
                        }
                    />

                    <FormTextField
                        label="Service Type"
                        value={as4Properties.service.type}
                        onChange={(value) =>
                            updateAs4({
                                service: {
                                    ...as4Properties.service,
                                    type: value,
                                },
                            })
                        }
                    />

                    <FormTextField
                        label="Action"
                        value={as4Properties.action.name}
                        required
                        onChange={(value) =>
                            updateAs4({
                                action: {
                                    ...as4Properties.action,
                                    name: value,
                                },
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <FormTextField
                        label="From Party Id"
                        value={as4Properties.fromParty.identifier}
                        required
                        onChange={(value) =>
                            updateAs4({
                                fromParty: {
                                    ...as4Properties.fromParty,
                                    identifier: value,
                                },
                            })
                        }
                    />

                    <FormTextField
                        label="From Party Role"
                        value={as4Properties.fromParty.role}
                        onChange={(value) =>
                            updateAs4({
                                fromParty: {
                                    ...as4Properties.fromParty,
                                    role: value,
                                },
                            })
                        }
                    />

                    <FormTextField
                        label="From Party Type"
                        value={as4Properties.fromParty.identifierType}
                        onChange={(value) =>
                            updateAs4({
                                fromParty: {
                                    ...as4Properties.fromParty,
                                    identifierType: value,
                                },
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <FormTextField
                        label="To Party Id"
                        value={as4Properties.toParty.identifier}
                        required
                        onChange={(value) =>
                            updateAs4({
                                toParty: {
                                    ...as4Properties.toParty,
                                    identifier: value,
                                },
                            })
                        }
                    />

                    <FormTextField
                        label="To Party Role"
                        value={as4Properties.toParty.role}
                        onChange={(value) =>
                            updateAs4({
                                toParty: {
                                    ...as4Properties.toParty,
                                    role: value,
                                },
                            })
                        }
                    />

                    <FormTextField
                        label="To Party Type"
                        value={as4Properties.toParty.identifierType}
                        onChange={(value) =>
                            updateAs4({
                                toParty: {
                                    ...as4Properties.toParty,
                                    identifierType: value,
                                },
                            })
                        }
                    />
                </div>
            </div>
        </section>
    );
}

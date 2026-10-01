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

import { SendParameters } from "@/types/send-message-form";
import { FormTextField } from "@/components/form/form-text-field";
import { OutboundMessageRequestModeSelector } from "@/components/message/outbound/outbound-message-request-mode-selector";

interface OutboundMessageSendParametersSectionProps {
    data: SendParameters;
    onChange: (next: SendParameters) => void;
    isModeLocked?: boolean;
}

export function OutboundMessageSendParametersSection({ data, onChange, isModeLocked = false }: OutboundMessageSendParametersSectionProps) {
    const update = (patch: Partial<SendParameters>) => {
        onChange({
            ...data,
            ...patch,
        });
    };

    return (
        <section className="rounded-md border bg-content1 p-2">
            <h2 className="mb-2 text-lg font-semibold">Send parameters</h2>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <OutboundMessageRequestModeSelector
                    value={data.mode}
                    isDisabled={isModeLocked}
                    onChange={(value) => update({ mode: value })}
                />

                <FormTextField
                    label="Attachment Size (MB)"
                    type="number"
                    value={String(data.attachmentSizeMB)}
                    onChange={(value) =>
                        update({ attachmentSizeMB: Number(value) || 0 })
                    }
                />

                <FormTextField
                    label="Repeat"
                    type="number"
                    value={String(data.repeatCount)}
                    onChange={(value) =>
                        update({ repeatCount: Number(value) || 0 })
                    }
                />
            </div>
        </section>
    );
}

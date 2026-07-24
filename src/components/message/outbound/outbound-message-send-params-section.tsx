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

import { FileSourceMode, PayloadGenerationMode, SendParameters } from "@/types/send-message-form";
import { FormTextField } from "@/components/form/form-text-field";
import { FileSourceModeSelect } from "@/components/message/outbound/outbound-message-file-mode-select";
import { RequestModeSelectField } from "@/components/message/outbound/outbound-message-request-mode-select";
import { FileUpload } from "@/components/message/outbound/outbound-message-file-upload";
import { ExecutionModeSelectField } from "@/components/message/outbound/outbound-message-execution-mode-select";
import { ReuseFieldSelectField } from "@/components/message/outbound/outbound-message-reuse-files-select";

interface OutboundMessageSendParametersSectionProps {
    data: SendParameters;
    onChange: (next: SendParameters) => void;
    onFilesSelect: (files: File[]) => void;
}

export function OutboundMessageSendParametersSection({
                                                         data,
                                                         onChange,
                                                         onFilesSelect,
                                                     }: OutboundMessageSendParametersSectionProps) {
    const update = (patch: Partial<SendParameters>) => {
        onChange({
            ...data,
            ...patch,
        });
    };

    const isGenerated = data.fileSource === FileSourceMode.GENERATED;
    const isSequential = data.payloadGenerationMode === PayloadGenerationMode.SEQUENTIAL;

    const normalizeThreads = (value: string) =>
        Math.min(Math.max(Number(value) || 1, 1), 10);

    return (
        <section className="rounded-md border bg-content1 p-2">
            <h2 className="mb-2 text-lg font-semibold">Send parameters</h2>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                <RequestModeSelectField
                    value={data.mode}
                    onChange={(value) => update({ mode: value })}
                />

                <ExecutionModeSelectField
                    value={data.payloadGenerationMode}
                    onChange={(value) => update({ payloadGenerationMode: value })}
                />

                {!isSequential && (
                    <>
                        <FormTextField
                            label="Gnerator threads"
                            type="number"
                            value={String(data.generatorThreads)}
                            onChange={(value) =>
                                update({ generatorThreads: normalizeThreads(value) })
                            }
                        />

                        <FormTextField
                            label="Submission threads"
                            type="number"
                            value={String(data.submitterThreads)}
                            onChange={(value) =>
                                update({ submitterThreads: normalizeThreads(value) })
                            }
                        />
                    </>
                )}

                <FormTextField
                    label="Repeat"
                    type="number"
                    value={String(data.repeatCount)}
                    onChange={(value) =>
                        update({ repeatCount: Number(value) || 0 })
                    }
                />

                <FileSourceModeSelect
                    value={data.fileSource}
                    onChange={(value) => update({ fileSource: value })}
                />

                {isGenerated ?
                    <>
                        <FormTextField
                            label="Attachment Size (MB)"
                            type="number"
                            value={String(data.attachmentSizeMB)}
                            onChange={(value) =>
                                update({ attachmentSizeMB: Number(value) || 0 })
                            }
                        />
                        <FormTextField
                            label="Attachment number"
                            type="number"
                            value={String(data.attachmentNumber)}
                            onChange={(value) =>
                                update({ attachmentNumber: Number(value) || 0 })
                            }
                        />
                    </>
                    :
                    <FileUpload
                        onFilesSelect={onFilesSelect}
                        text="Upload Business Document(s)"
                    />
                }

                <ReuseFieldSelectField
                    value={data.reuseFiles}
                    onChange={(value) => update({ reuseFiles: value })}/>

            </div>
        </section>
    );
}

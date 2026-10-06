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

import { useId, useRef } from "react";
import { Button, Label } from "@heroui/react";
import { FileTrigger } from "react-aria-components";

interface FileSelectFieldProps {
    label: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    acceptedFileTypes?: string[];
    buttonLabel?: string;
    placeholder?: string;
    clearLabel?: string;
    error?: string;
}

export function FileSelectField({
                                    label,
                                    file,
                                    onFileChange,
                                    acceptedFileTypes,
                                    buttonLabel = "Choose file…",
                                    placeholder = "No file selected",
                                    clearLabel = "Remove file",
                                    error,
                                }: FileSelectFieldProps) {
    const labelId = useId();
    const errorId = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleClear = () => {
        onFileChange(null);
        // The clear button unmounts, so send focus back to the trigger.
        triggerRef.current?.focus();
    };

    return (
        <div className="flex flex-col gap-2">
            <Label id={labelId} className="font-semibold">
                {label}
            </Label>
            <div className="flex items-center gap-3">
                <FileTrigger
                    acceptedFileTypes={acceptedFileTypes}
                    onSelect={(files) => onFileChange(files?.[0] ?? null)}
                >
                    <Button
                        ref={triggerRef}
                        variant="secondary"
                        aria-labelledby={labelId}
                        aria-describedby={error ? errorId : undefined}
                    >
                        {buttonLabel}
                    </Button>
                </FileTrigger>
                <span className="min-w-0 truncate text-sm text-default-500">
                    {file ? file.name : placeholder}
                </span>
                {file && (
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={`${clearLabel}: ${file.name}`}
                        onPress={handleClear}
                    >
                        ✕
                    </Button>
                )}
            </div>
            {error && (
                <span id={errorId} role="alert" className="text-sm text-danger">
                    {error}
                </span>
            )}
        </div>
    );
}

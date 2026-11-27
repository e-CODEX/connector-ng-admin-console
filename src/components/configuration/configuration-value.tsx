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

import { Button, Tooltip } from "@heroui/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const COPY_FEEDBACK_MS = 1500;

interface ConfigurationValueProps {
    value: string | null | undefined;
    mono?: boolean;
    copyable?: boolean;
}

export function ConfigurationValue({ value, mono = false, copyable = false }: ConfigurationValueProps) {
    if (!value) {
        return <span className="text-muted">—</span>;
    }

    return (
        <span className="inline-flex max-w-full items-center gap-1">
            <span className={`min-w-0 break-all ${mono ? "font-mono" : ""}`}>{value}</span>
            {copyable && <CopyButton value={value} />}
        </span>
    );
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        },
        [],
    );

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
        } catch {
            // Clipboard unavailable
        }
    };

    return (
        <Tooltip delay={0}>
            <Button isIconOnly size="sm" variant="tertiary" aria-label={copied ? "Copied" : "Copy value"} onPress={copy} className="size-6 min-w-6 shrink-0">
                {copied ? <Check aria-hidden="true" className="size-3.5 text-success" /> : <Copy aria-hidden="true" className="size-3.5" />}
            </Button>
            <Tooltip.Content>{copied ? "Copied!" : "Copy value"}</Tooltip.Content>
        </Tooltip>
    );
}

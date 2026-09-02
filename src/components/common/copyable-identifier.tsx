/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Button, Tooltip } from "@heroui/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { truncate } from "@/utils";

const COPY_FEEDBACK_MS = 1500;

export interface CopyableIdentifierProps {
    identifier: string | null | undefined;
    visibleChars?: number;
    iconPosition?: "left" | "right";
    className?: string;
    textClassName?: string;
}

export function CopyableIdentifier({
                                       identifier, visibleChars = 36,
                                       iconPosition = "left",
                                       className,
                                       textClassName
                                   }:
                                   CopyableIdentifierProps) {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const hasIdentifier = identifier != null && identifier.trim() !== "";

    const handleCopy = async () => {
        if (!hasIdentifier) {
            return;
        }
        try {
            await navigator.clipboard.writeText(identifier);
            setCopied(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
        } catch {
        }
    };

    const copyButton = (
        <Tooltip delay={0}>
            <Button
                isIconOnly
                size="sm"
                variant="tertiary"
                aria-label={copied ? "Identifier copied" : "Copy Identifier"}
                onPress={handleCopy}
                className="size-6 min-w-6 shrink-0"
            >
                {copied ? (
                    <Check aria-hidden="true" size={14} className="text-success"/>
                ) : (
                    <Copy aria-hidden="true" size={14}/>
                )}
            </Button>
            <Tooltip.Content>{copied ? "Copied!" : "Copy Identifier"}</Tooltip.Content>
        </Tooltip>
    );

    const text = (
        <span
            className={`font-semibold truncate ${textClassName ?? ""}`}
            title={identifier ?? undefined}
        >
            {truncate(identifier ?? "", visibleChars)}
        </span>
    );

    return (
        <div className={`inline-flex items-center gap-1 ${className ?? ""}`}>
            {iconPosition === "left" ? (
                <>
                    {hasIdentifier && copyButton}
                    {text}
                </>
            ) : (
                <>
                    {text}
                    {hasIdentifier && copyButton}
                </>
            )}
        </div>
    );
}

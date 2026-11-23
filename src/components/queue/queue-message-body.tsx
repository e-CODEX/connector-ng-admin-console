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

import React, { useEffect, useRef, useState } from "react";
import { Button, Chip, Tooltip } from "@heroui/react";
import { Check, Copy, TriangleAlert } from "lucide-react";
import type { ConnectorQueueMessageDetail, ConnectorQueueMessageType } from "@/types/response/queue";
import { formatCount } from "@/utils";

const COPY_FEEDBACK_MS = 1500;
const JSON_INDENT = 8;

const TYPE_DESCRIPTIONS: Record<ConnectorQueueMessageType, string> = {
    TEXT: "Text content.",
    MAP: "A set of name/value pairs.",
    BYTES: "Binary content, shown as returned by the connector.",
    OBJECT: "A serialized Java object, shown as returned by the connector.",
    STREAM: "A sequence of typed values, in the order they were written.",
    UNKNOWN: "A plain JMS message: it has no body, only headers and properties.",
};

function BodyContent({ type, text, payload }: { type: ConnectorQueueMessageType; text: string; payload: Record<string, unknown> | null }) {
    const hasText = Boolean(text);
    const entries = payload ? Object.entries(payload) : [];

    switch (type) {
        case "UNKNOWN":
            return null;
        case "TEXT":
            if (hasText) return <TextBody text={text} />;
            // No text: some text messages arrive with their content parsed into `payload` instead.
            return entries.length > 0 ? <CodeBlock label="Payload" content={JSON.stringify(payload, null, JSON_INDENT)} /> : <Empty />;
        case "MAP":
            return entries.length > 0 ? <MapBody entries={entries} /> : <Empty />;
        default:
            if (!hasText && entries.length === 0) return <Empty />;
            return (
                <div className="flex min-h-0 flex-col gap-3">
                    {hasText && <CodeBlock label="Content" content={text} />}
                    {entries.length > 0 && <CodeBlock label="Payload" content={JSON.stringify(payload, null, JSON_INDENT)} />}
                </div>
            );
    }
}

function Empty() {
    return <p className="text-sm text-muted">No body.</p>;
}

type TextFormat = "JSON" | "Plain text";

function detectFormat(text: string): { format: TextFormat; formatted: string } {
    const trimmed = text.trim();

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            return { format: "JSON", formatted: JSON.stringify(JSON.parse(trimmed), null, JSON_INDENT) };
        } catch {
            // Not valid JSON (or truncated): fall through to plain text.
        }
    }

    return { format: "Plain text", formatted: text };
}

function TextBody({ text }: { text: string }) {
    const { format, formatted } = detectFormat(text);
    const canFormat = formatted !== text;
    const [showRaw, setShowRaw] = useState(false);
    const content = showRaw || !canFormat ? text : formatted;

    return (
        <div className="flex min-h-0 flex-col">
            <div className="mb-1 flex shrink-0 flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">{format}</span>
                <span className="text-xs text-muted">· {formatCount(text.length)} characters</span>
                <div className="ml-auto flex items-center gap-1">
                    {canFormat && (
                        <Button size="sm" variant="tertiary" onPress={() => setShowRaw((raw) => !raw)}>
                            {showRaw ? "Formatted" : "Raw"}
                        </Button>
                    )}
                    <CopyButton content={content} label="Copy body" />
                </div>
            </div>
            <Pre content={content} />
        </div>
    );
}

const valueType = (value: unknown) => (value === null ? "null" : Array.isArray(value) ? "array" : typeof value);
const valueText = (value: unknown) => (value !== null && typeof value === "object" ? JSON.stringify(value, null, JSON_INDENT) : String(value));

function MapBody({ entries }: { entries: [string, unknown][] }) {
    const sorted = [...entries].sort(([a], [b]) => a.localeCompare(b));

    return (
        <div className="flex min-h-0 flex-col">
            <div className="mb-1 flex shrink-0 items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">
                    {formatCount(sorted.length)} {sorted.length === 1 ? "entry" : "entries"}
                </span>
                <div className="ml-auto">
                    <CopyButton content={JSON.stringify(Object.fromEntries(sorted), null, JSON_INDENT)} label="Copy entries as JSON" />
                </div>
            </div>
            <div className="min-h-0 overflow-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-surface-secondary text-left text-xs uppercase tracking-wider text-muted">
                        <tr>
                            <th className="px-3 py-2 font-medium">Name</th>
                            <th className="px-3 py-2 font-medium">Value</th>
                            <th className="px-3 py-2 font-medium">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(([name, value]) => (
                            <tr key={name} className="border-t border-separator align-top">
                                <td className="px-3 py-2 font-semibold">{name}</td>
                                <td className="break-all px-3 py-2 font-mono text-xs">{valueText(value)}</td>
                                <td className="px-3 py-2 text-xs text-muted">{valueType(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CodeBlock({ label, content }: { label: string; content: string }) {
    return (
        <div className="flex min-h-0 flex-col">
            <div className="mb-1 flex shrink-0 items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
                <div className="ml-auto">
                    <CopyButton content={content} label={`Copy ${label.toLowerCase()}`} />
                </div>
            </div>
            <Pre content={content} />
        </div>
    );
}

function Pre({ content }: { content: string }) {
    return <pre className="min-h-0 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-surface-secondary p-3 font-mono text-sm">{content}</pre>;
}

function CopyButton({ content, label }: { content: string; label: string }) {
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
            await navigator.clipboard.writeText(content);
            setCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
        } catch {
            // Clipboard unavailable (permissions, insecure context): the text can still be selected by hand.
        }
    };

    return (
        <Tooltip delay={0}>
            <Button isIconOnly size="sm" variant="tertiary" aria-label={copied ? "Copied" : label} onPress={copy}>
                {copied ? <Check aria-hidden="true" className="size-4 text-success" /> : <Copy aria-hidden="true" className="size-4" />}
            </Button>
            <Tooltip.Content>{copied ? "Copied!" : label}</Tooltip.Content>
        </Tooltip>
    );
}

export function QueueMessageBody({ detail }: { detail: ConnectorQueueMessageDetail }) {
    const { message, text, payload, truncated } = detail;
    const type = message.messageType;
    const description = TYPE_DESCRIPTIONS[type] ?? "Content shown as returned by the connector.";

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Chip size="sm" variant="soft" color="accent">
                    <Chip.Label>{type || "Unknown type"}</Chip.Label>
                </Chip>
                <span className="text-sm text-muted">{description}</span>
            </div>

            {truncated && (
                <p className="flex shrink-0 items-center gap-2 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning-soft-foreground">
                    <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
                    The body is too large and is shown truncated.
                </p>
            )}

            <BodyContent type={type} text={text} payload={payload} />
        </div>
    );
}

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

import { cn } from "@heroui/react";
import { useIsHydrated } from "@/hooks/use-is-hydrated";

export type DateTimePrecision = "date" | "minute" | "second" | "millis";

const OPTIONS: Record<DateTimePrecision, Intl.DateTimeFormatOptions> = {
    date: { year: "numeric", month: "2-digit", day: "2-digit" },
    minute: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false },
    second: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false },
    millis: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false
    },
};

// Intl.DateTimeFormat construction is expensive — cache per (locale, precision, tz).
const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(locale: string, precision: DateTimePrecision, timeZone?: string) {
    const key = `${locale}|${precision}|${timeZone ?? "local"}`;
    let formatter = formatterCache.get(key);
    if (!formatter) {
        formatter = new Intl.DateTimeFormat(locale, { ...OPTIONS[precision], timeZone });
        formatterCache.set(key, formatter);
    }
    return formatter;
}

function toDate(value: Date | string | number | null | undefined): Date | null {
    if (value === null || value === undefined || value === "") return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(
    value: Date | string | number | null | undefined,
    { precision = "millis", locale = "en-US", timeZone }: {
        precision?: DateTimePrecision;
        locale?: string;
        timeZone?: string;
    } = {},
): string | null {
    const date = toDate(value);
    return date ? getFormatter(locale, precision, timeZone).format(date) : null;
}

interface DateTimeProps {
    value: Date | string | number | null | undefined;
    precision?: DateTimePrecision;
    locale?: string;
    timeZone?: string;
    placeholder?: string;
    className?: string;
}

export function DateTime({
                             value,
                             precision = "millis",
                             locale = "en-US",
                             timeZone,
                             placeholder = "—",
                             className,
                         }: DateTimeProps) {
    const isHydrated = useIsHydrated();
    const date = toDate(value);

    if (!date) {
        return <span className={cn("text-default-400", className)}>{placeholder}</span>;
    }

    // Local-zone formatting is only stable once we're on the client.
    const canFormat = timeZone !== undefined || isHydrated;
    const iso = date.toISOString();

    return (
        <time
            dateTime={iso}
            title={iso}
            className={cn("tabular-nums whitespace-nowrap", className)}
            suppressHydrationWarning
        >
            {canFormat ? getFormatter(locale, precision, timeZone).format(date) : "\u00A0"}
        </time>
    );
}

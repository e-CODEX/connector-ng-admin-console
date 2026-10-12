/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { RangeValue } from "react-aria-components";
import { ZonedDateTime, now, getLocalTimeZone } from "@internationalized/date";
import { DateTimeRangeGranularity } from "@/components/form/selector/date-time-range-selector";

export type Period =
    | "LAST_HOUR"
    | "TODAY"
    | "THIS_WEEK"
    | "THIS_MONTH"
    | "THIS_YEAR"
    | "ALL";

export interface PeriodOption {
    id: Period;
    label: string;
}

export const PERIOD_OPTIONS: readonly PeriodOption[] = [
    { id: "LAST_HOUR", label: "Last hour" },
    { id: "TODAY", label: "Today" },
    { id: "THIS_WEEK", label: "This week" },
    { id: "THIS_MONTH", label: "This month" },
    { id: "THIS_YEAR", label: "This year" },
    { id: "ALL", label: "All" },
] as const;

export const DEFAULT_PERIOD: Period = "TODAY";

export interface PeriodRange {
    from: Date | null;
    to: Date | null;
}

export function getPeriodRange(period: Period, now: Date = new Date()): PeriodRange {
    const from = new Date(now);
    const to = new Date(now);

    switch (period) {
        case "LAST_HOUR":
            from.setHours(from.getHours() - 1);
            to.setHours(to.getHours());
            return { from, to };

        case "TODAY":
            from.setHours(0, 0, 0, 0);
            return { from, to };

        case "THIS_WEEK": {
            from.setHours(0, 0, 0, 0);
            // Monday = start of week (ISO / European convention).
            const isoDay = (from.getDay() + 6) % 7; // Mon=0 ... Sun=6
            from.setDate(from.getDate() - isoDay);
            return { from, to };
        }

        case "THIS_MONTH":
            from.setHours(0, 0, 0, 0);
            from.setDate(1);
            return { from, to };

        case "THIS_YEAR":
            from.setHours(0, 0, 0, 0);
            from.setMonth(0, 1);
            return { from, to };

        case "ALL":
            return { from: null, to: null };
    }
}

export function periodToParams(period: Period,):
    { from?: string; to?: string } {
    const { from, to } = getPeriodRange(period);
    return {
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
    };
}

const startOfDay = { hour: 0, minute: 0, second: 0, millisecond: 0 } as const;
const endOfDay = { hour: 23, minute: 59, second: 59, millisecond: 0 } as const;

export const toDateRange = (
    selected: RangeValue<ZonedDateTime> | null,
    rangeGranularity: DateTimeRangeGranularity,
) => {
    if (!selected) {
        return { from: "", to: "" };
    }

    let from = selected.start;
    let to = selected.end;

    if (rangeGranularity === "day") {
        from = selected.start.set(startOfDay);
        to = selected.end.set(endOfDay);
    }

    return {
        // ZonedDateTime#toDate() -> absolute instant; toISOString() -> UTC.
        from: from.toDate().toISOString(),
        to: to.toDate().toISOString(),
    };
}

export const buildDefaultRange = () : RangeValue<ZonedDateTime> => {
    const todayZoned = now(getLocalTimeZone());
    return { start: todayZoned.set(startOfDay), end: todayZoned.set(endOfDay) };
}

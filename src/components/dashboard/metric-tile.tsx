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

type Tone = "default" | "success" | "warning" | "danger";

const TONE_TEXT: Record<Tone, string> = {
    default: "text-foreground",
    success: "text-green-800 ",
    warning: "text-orange-700",
    danger: "text-red-800 ",
};

export function MetricTile({ label, value, tone = "default" }: {
    label: string;
    value: number | undefined;
    tone?: Tone;
}) {
    return (
        <div className="rounded-large bg-default-100 px-4 py-3">
            <p className="text-xs opacity-80">{label}</p>
            <p className={`mt-1 text-xl font-semibold tabular-nums ${TONE_TEXT[tone]}`}>
                {value?.toLocaleString()}
            </p>
        </div>
    );
}

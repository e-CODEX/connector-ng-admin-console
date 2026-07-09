/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export function MessageReportingKpi({ label, value, dot, sub }: { label: string; value: number; dot?: string; sub?: string }) {
    return (
        <div className="bg-content1 rounded-xl border border-default-200 p-4">
            <div className="flex items-center gap-1.5 text-xs text-default-500 mb-1">
                {dot && <span className="w-2 h-2 rounded-full" style={{ background: dot }}/>}
                {label}
            </div>
            <div className="text-2xl font-semibold text-foreground tabular-nums">{value.toLocaleString()}</div>
            {sub && <div className="text-[11px] text-default-400 mt-0.5">{sub}</div>}
        </div>
    );
}

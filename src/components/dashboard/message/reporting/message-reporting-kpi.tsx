/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Card } from "@heroui/react";

interface MessageReportingKpiProps {
    label: string;
    value: number;
    dot?: string;
    sub?: string;
}

export function MessageReportingKpi({ label, value, dot, sub }: MessageReportingKpiProps) {
    return (
        <Card variant="default" className="gap-0 p-4">
            <Card.Header className="p-0">
                <Card.Description className="flex items-center gap-1.5 text-md font-semibold">
                    {dot && <span className="size-2 rounded-full" style={{ background: dot }}/>}
                    {label}
                </Card.Description>
            </Card.Header>
            <Card.Content className="p-0">
                <div className="text-xl font-semibold tabular-nums">{value.toLocaleString()}</div>
                {sub && <div className="text-[11px] text-muted mt-0.5">{sub}</div>}
            </Card.Content>
        </Card>
    );
}

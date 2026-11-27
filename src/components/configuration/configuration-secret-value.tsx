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

import { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

interface ConfigurationSecretValueProps {
    value: string | null | undefined;
}

export function ConfigurationSecretValue({ value }: ConfigurationSecretValueProps) {
    const [shown, setShown] = useState(false);

    if (!value) {
        return <span className="text-muted">—</span>;
    }

    const label = shown ? "Hide value" : "Reveal value";

    return (
        <span className="inline-flex max-w-full items-center gap-1">
            <span className={`min-w-0 break-all font-mono ${shown ? "" : "tracking-widest text-muted"}`}>{shown ? value : "••••••••"}</span>
            <Tooltip delay={0}>
                <Button isIconOnly size="sm" variant="tertiary" aria-label={label} onPress={() => setShown((s) => !s)} className="size-6 min-w-6 shrink-0">
                    {shown ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Eye aria-hidden="true" className="size-3.5" />}
                </Button>
                <Tooltip.Content>{label}</Tooltip.Content>
            </Tooltip>
        </span>
    );
}

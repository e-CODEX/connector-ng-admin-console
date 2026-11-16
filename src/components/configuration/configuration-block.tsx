/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Surface } from "@heroui/react";
import type { ReactNode } from "react";

interface ConfigurationBlockProps {
    title: string;
    note?: string;
    children: ReactNode;
}

export function ConfigurationBlock({ title, note, children }: ConfigurationBlockProps) {
    return (
        <Surface className="rounded-xl p-4">
            <div className="mb-2 flex items-baseline gap-2">
                <h4 className="text-sm font-medium">{title}</h4>
                {note && <code className="font-mono text-xs text-neutral-400">{note}</code>}
            </div>
            {children}
        </Surface>
    );
}

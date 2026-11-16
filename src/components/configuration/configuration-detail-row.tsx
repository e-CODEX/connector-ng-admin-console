/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ReactNode } from "react";

interface ConfigurationDetailRowProps {
    label: string;
    children: ReactNode;
}

export function ConfigurationDetailRow({ label, children }: ConfigurationDetailRowProps) {
    return (
        <div className="grid grid-cols-[minmax(0,300px)_1fr] items-baseline gap-4 py-1.5">
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">{label}</dt>
            <dd className="min-w-0 wrap-break-word font-mono text-sm">{children}</dd>
        </div>
    );
}

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

export function ConfigurationDetailList({ children }: { children: ReactNode }) {
    return <dl className="flex flex-col">{children}</dl>;
}

interface ConfigurationDetailRowProps {
    label: string;
    children?: ReactNode;
}

export function ConfigurationDetailRow({ label, children }: ConfigurationDetailRowProps) {
    const isEmpty = children === undefined || children === null || children === "";

    return (
        <div className="flex flex-col gap-0.5 border-b border-separator py-2 last:border-b-0 sm:grid sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:items-center sm:gap-4">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="min-w-0 text-sm wrap-break-word">{isEmpty ? <span className="text-muted">—</span> : children}</dd>
        </div>
    );
}

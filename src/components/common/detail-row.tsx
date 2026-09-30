/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import React from "react";

interface DetailRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

export function DetailRow({ label, value, className }: DetailRowProps) {
    return (
        <div
            className={`flex justify-between gap-4 py-1.5 border-b border-separator ${className ?? ""}`}>
            <span className="font-semibold text-muted whitespace-nowrap">{label}</span>
            <span className="text-right break-all">{value}</span>
        </div>
    );
}

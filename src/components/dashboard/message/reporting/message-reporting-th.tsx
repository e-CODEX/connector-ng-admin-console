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

interface MessageReportingThProps {
    children: React.ReactNode;
    onClick: () => void;
    align?: "left" | "right"
}

export function MessageReportingTh({ children, onClick, align = "left" }: MessageReportingThProps) {
    return (
        <th onClick={onClick}
            className={`px-4 py-2 font-medium cursor-pointer select-none hover:text-default-600 ${align === "right" ? "text-right" : "text-left"}`}>
            {children}
        </th>
    );
}

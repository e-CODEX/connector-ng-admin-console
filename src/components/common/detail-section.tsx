/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Typography } from "@heroui/react";
import React from "react";

interface DetailSectionProps {
    title: string;
    isEmpty: boolean;
    emptyLabel: string;
    children: React.ReactNode;
}

export function DetailSection({ title, isEmpty, emptyLabel, children }: DetailSectionProps) {
    return (
        <div>
            <Typography.Heading level={6} className="mt-5 mb-3">{title}</Typography.Heading>
            {isEmpty ? <p className="text-muted text-sm">{emptyLabel}</p> : children}
        </div>
    );
}

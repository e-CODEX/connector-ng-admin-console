/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Check, X } from "lucide-react";
import { Chip } from "@heroui/react";

interface BooleanChipProps {
    value: boolean;
    yesLabel?: string;
    noLabel?: string;
    showLabel?: boolean;
}

export function BooleanChip({ value, yesLabel = "Yes", noLabel = "No", showLabel = true }: BooleanChipProps) {
    const Icon = value ? Check : X;
    const label = value ? yesLabel : noLabel;

    return (
        <Chip
            color={value ? "success" : "danger"}
            variant="soft"
            size="sm"
            className="gap-1.5 [&_svg]:text-inherit"
            aria-label={label}
        >
            <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
            {showLabel && <Chip.Label>{label}</Chip.Label>}
        </Chip>
    );
}

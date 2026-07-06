/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Check, Minus } from "lucide-react";
import { Chip } from "@heroui/react";

export function ConfigurationBoolChip({ value, label }: { value: boolean; label: string }) {
    return (
        <Chip variant="soft" size="sm" color={value ? "success" : "default"}>
            {value ? <Check className="size-3"/> : <Minus className="size-3"/>}
            {label}
        </Chip>
    );
}

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

import type { Key } from "@heroui/react";
import { ListBox, Select } from "@heroui/react";
import { Period, PERIOD_OPTIONS } from "@/types/period";


interface PeriodFilterProps {
    value: Period;
    onChange: (period: Period) => void;
    label?: string;
    className?: string;
}

export function PeriodFilterSelector({ value, onChange, className = "w-44", }: PeriodFilterProps) {
    return (
        <Select
            aria-label="Period"
            className={className}
            value={value}
            onChange={(key: Key | null) => {
                if (key) onChange(key as Period);
            }}
        >
            <Select.Trigger>
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {PERIOD_OPTIONS.map((option) => (
                        <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
                            {option.label}
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { FieldError, Key, Label, ListBox, Select } from "@heroui/react";

const DIRECTION_OPTIONS: { id: string; label: string }[] = [
    { id: "All", label: "All" },
    { id: "BACKEND_TO_GATEWAY", label: "Outbound" },
    { id: "GATEWAY_TO_BACKEND", label: "Inbound" },
];

export interface MessageDirectionSelectorProps {
    name?: string;
    value?: string | null;
    onValueChange: (direction: string | null) => void;
    label?: string;
    isDisabled?: boolean;
    className?: string;
}

export function MessageDirectionSelector({
                                             value,
                                             onValueChange,
                                             name,
                                             label = "Direction",
                                             isDisabled = false,
                                             className = "min-w-70",
                                         }: MessageDirectionSelectorProps) {
    const handleChange = (key: Key | null) => {
        const selected = DIRECTION_OPTIONS.find((option) => option.id === key);
        onValueChange(selected?.id ?? null);
    };

    return (
        <Select
            name={name}
            value={value ?? null}
            onChange={handleChange}
            isDisabled={isDisabled}
            className={className}
            placeholder="Select direction"
        >
            <Label className="font-semibold">{label}</Label>
            <Select.Trigger>
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {DIRECTION_OPTIONS.map((option) => (
                        <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
                            {option.label}
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
            <FieldError/>
        </Select>
    );
}

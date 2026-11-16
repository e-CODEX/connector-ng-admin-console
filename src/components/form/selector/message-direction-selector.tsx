/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { Key} from "@heroui/react";
import { FieldError, Label, ListBox, Select } from "@heroui/react";
import { useMemo } from "react";
import type { MessageDirection } from "@/types/global";

export const ALL_DIRECTIONS = "*" as const;

export type MessageDirectionFilter = MessageDirection | typeof ALL_DIRECTIONS;

interface DirectionOption {
    id: MessageDirectionFilter;
    label: string;
}

const DIRECTION_OPTIONS: readonly DirectionOption[] = [
    { id: "BACKEND_TO_GATEWAY", label: "Outbound" },
    { id: "GATEWAY_TO_BACKEND", label: "Inbound" },
];

const ALL_OPTION: DirectionOption = { id: ALL_DIRECTIONS, label: "All" };

export interface MessageDirectionSelectorProps {
    name?: string;
    value?: string | null;
    onValueChange: (direction: MessageDirectionFilter | null) => void;
    label?: string;
    isDisabled?: boolean;
    showAll?: boolean;
    className?: string;
}

export function MessageDirectionSelector({
                                             value,
                                             onValueChange,
                                             name,
                                             label = "Direction",
                                             isDisabled = false,
                                             showAll = false,
                                             className = "min-w-40",
                                         }: MessageDirectionSelectorProps) {
    const options = useMemo(
        () => (showAll ? [ALL_OPTION, ...DIRECTION_OPTIONS] : DIRECTION_OPTIONS),
        [showAll],
    );

    const handleChange = (key: Key | null) => {
        const selected = options.find((option) => option.id === key);
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
                    {options.map((option) => (
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

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
import { ConnectorProcessingModeAction } from "@/types/response/processing-mode";

export interface ProcessingModeServiceSelectorProps {
    actions: ConnectorProcessingModeAction[];
    value?: string | null;
    onValueChange: (service: ConnectorProcessingModeAction | null) => void;
    label?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}

const keyOf = (party: ConnectorProcessingModeAction) => party.name;

export function ProcessingModeActionSelector({
                                                 actions,
                                                 value,
                                                 onValueChange,
                                                 label = "Action",
                                                 isRequired = false,
                                                 isDisabled,
                                                 className = "min-w-70",
                                             }: ProcessingModeServiceSelectorProps) {
    const handleChange = (key: Key | null) => {
        onValueChange(actions.find((party) => keyOf(party) === key) ?? null);
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            isRequired={isRequired}
            isDisabled={isDisabled}
            className={className}
            placeholder="Select an action"
        >
            <Label className="font-semibold">{label}</Label>
            <Select.Trigger>
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {actions.map((party) => {
                        const id = keyOf(party);
                        return (
                            <ListBox.Item key={id} id={id} textValue={party.name}>
                                {party.name}
                                <ListBox.ItemIndicator/>
                            </ListBox.Item>
                        );
                    })}
                </ListBox>
            </Select.Popover>
            <FieldError />
        </Select>
    );
}

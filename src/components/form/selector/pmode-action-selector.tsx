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
import type { ConnectorProcessingModeAction } from "@/types/response/processing-mode";
import { useEffect, useMemo } from "react";

export interface ProcessingModeActionSelectorProps {
    actions: ConnectorProcessingModeAction[];
    name?: string;
    value?: string | null;
    onValueChange: (action: ConnectorProcessingModeAction | null) => void;
    label?: string;
    onlyTestActions?: boolean;
    autoSelectSingle?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}

export const actionKeyOf = (action: Pick<ConnectorProcessingModeAction, "name">) => action.name;

export function ProcessingModeActionSelector({
                                                 actions,
                                                 value,
                                                 onValueChange,
                                                 name,
                                                 label = "Action",
                                                 onlyTestActions = false,
                                                 autoSelectSingle = true,
                                                 isRequired = false,
                                                 isDisabled = false,
                                                 className = "min-w-70",
                                             }: ProcessingModeActionSelectorProps) {
    const visibleActions = useMemo(
        () => (onlyTestActions ? actions.filter((action) => action.testOnly) : actions),
        [actions, onlyTestActions],
    );

    useEffect(() => {
        if (isDisabled || visibleActions.length === 0) return;
        const isValueVisible = value != null && visibleActions.some((action) => actionKeyOf(action) === value);
        if (isValueVisible) return;
        if (autoSelectSingle && visibleActions.length === 1) {
            onValueChange(visibleActions[0]);
        } else if (value) {
            onValueChange(null);
        }
    }, [autoSelectSingle, isDisabled, visibleActions, value, onValueChange]);

    const handleChange = (key: Key | null) => {
        onValueChange(visibleActions.find((action) => actionKeyOf(action) === key) ?? null);
    };

    return (
        <Select
            name={name}
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
                    {visibleActions.map((action) => {
                        const id = actionKeyOf(action);
                        return (
                            <ListBox.Item key={id} id={id} textValue={action.name}>
                                {action.name}
                                <ListBox.ItemIndicator/>
                            </ListBox.Item>
                        );
                    })}
                </ListBox>
            </Select.Popover>
            <FieldError/>
        </Select>
    );
}


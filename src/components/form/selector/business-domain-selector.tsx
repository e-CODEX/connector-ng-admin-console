/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { FieldError, Label, ListBox, Select } from "@heroui/react";

interface BusinessDomainSelectorProps {
    name?: string;
    identifiers: string[];
    value?: string | null;
    onValueChange: (identifier: string) => void;
    label?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    showLabel?: boolean;
    className?: string;
}

export const asBusinessDomainSelectorFilter = (value: string, selector: string) => (value === selector ? undefined : value);

export function BusinessDomainSelector({
                                           name,
                                           identifiers,
                                           value,
                                           onValueChange,
                                           label = "Business domain",
                                           isRequired = false,
                                           isDisabled,
                                           showLabel = true,
                                           className = "min-w-70",
                                       }: BusinessDomainSelectorProps) {
    return (
        <Select
            name={name}
            aria-label={label}
            value={value}
            onChange={(key) => onValueChange(key as string)}
            isRequired={isRequired}
            isDisabled={isDisabled}
            className={className}
            placeholder="Select a business domain"
        >
            {showLabel && <Label className="font-semibold">{label}</Label>}
            <Select.Trigger className="flex-1">
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {identifiers.map((identifier) => (
                        <ListBox.Item key={identifier} id={identifier} textValue={identifier}>
                            {identifier}
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
            <FieldError/>
        </Select>
    );
}

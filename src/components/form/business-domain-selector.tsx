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

export interface BusinessDomainSelectorProps {
    identifiers: string[];
    value: string;
    onValueChange: (identifier: string) => void;
    error?: string;
    label?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
}

export function BusinessDomainSelector({
                                           identifiers,
                                           value,
                                           onValueChange,
                                           error,
                                           label = "Business domain",
                                           isRequired = false,
                                           isDisabled,
                                       }: BusinessDomainSelectorProps) {
    const showError = isRequired && !!error;

    return (
        <Select
            value={value}
            onChange={(key) => onValueChange(key as string)}
            isInvalid={showError}
            isRequired={isRequired}
            isDisabled={isDisabled}
        >
            <Label className="font-semibold">{label}</Label>
            <Select.Trigger>
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
            {isRequired && <FieldError>{error}</FieldError>}
        </Select>
    );
}

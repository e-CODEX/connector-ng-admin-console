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
import { ConnectorLinkPartner } from "@/types/response/link-partner";

export interface LinkPartnerSelectorProps {
    partners: ConnectorLinkPartner[];
    value?: string | null;
    onValueChange: (service: ConnectorLinkPartner | null) => void;
    label?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}

const keyOf = (linkPartner: ConnectorLinkPartner) => linkPartner.name;

export function LinkPartnerSelector({
                                        partners,
                                        value,
                                        onValueChange,
                                        label = "Backend Name",
                                        isRequired = false,
                                        isDisabled,
                                        className = "min-w-70",
                                    }: LinkPartnerSelectorProps) {
    const handleChange = (key: Key | null) => {
        onValueChange(partners.find((party) => keyOf(party) === key) ?? null);
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            isRequired={isRequired}
            isDisabled={isDisabled}
            className={className}
            placeholder="Select a partner"
        >
            <Label className="font-semibold">{label}</Label>
            <Select.Trigger>
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {partners.map((party) => {
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
            <FieldError/>
        </Select>
    );
}

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
import { ConnectorProcessingModeParty } from "@/types/response/processing-mode";
import { PartyRoleType } from "@/types/global";

export interface ProcessingModeServiceSelectorProps {
    parties: ConnectorProcessingModeParty[];
    value?: string | null;
    onValueChange: (service: ConnectorProcessingModeParty | null) => void;
    label?: string;
    showType?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    role?: PartyRoleType;
    className?: string;
}

const keyOf = (party: ConnectorProcessingModeParty) => `${party.identifier}-${party.roleType}`;

export function ProcessingModePartySelector({
                                                parties,
                                                value,
                                                onValueChange,
                                                label = "Party",
                                                showType = false,
                                                isRequired = false,
                                                isDisabled,
                                                role = "INITIATOR",
                                                className = "min-w-70",
                                            }: ProcessingModeServiceSelectorProps) {
    const visible = parties.filter((party) => {
        if (party.roleType !== role) return false;
        return role === "INITIATOR" ? party.isHome : true;
    });

    const handleChange = (key: Key | null) => {
        onValueChange(parties.find((party) => keyOf(party) === key) ?? null);
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            isRequired={isRequired}
            isDisabled={isDisabled}
            className={className}
            placeholder="Select a party"
        >
            <Label className="font-semibold">{label}</Label>
            <Select.Trigger>
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {visible.map((party) => {
                        const id = keyOf(party);

                        return (
                            <ListBox.Item key={id} id={id} textValue={party.name}>
                                {showType ? (
                                    `${party.roleType} (${party.identifier} - ${party.identifierType} - ${party.isHome ? "Home" : ""})`
                                ) : (
                                    party.identifier
                                )}
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

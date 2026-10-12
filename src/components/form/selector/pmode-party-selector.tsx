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
import { useEffect, useMemo } from "react";

export interface ProcessingModePartySelectorProps {
    parties: ConnectorProcessingModeParty[];
    value?: string | null;
    onValueChange: (party: ConnectorProcessingModeParty | null) => void;
    /** Only offer parties with this role type. Applied before the single-entry auto-select. */
    role?: ConnectorProcessingModeParty["roleType"];
    name?: string;
    label?: string;
    showType?: boolean;
    autoSelectSingle?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}

const partyKeyOf = (party: Pick<ConnectorProcessingModeParty, "identifier" | "identifierType">) =>
    `${party.identifier}-${party.identifierType}`;

export function ProcessingModePartySelector({
                                                parties,
                                                value,
                                                onValueChange,
                                                role = "INITIATOR",
                                                name,
                                                label = "Party",
                                                showType = false,
                                                autoSelectSingle = true,
                                                isRequired = false,
                                                isDisabled = false,
                                                className = "min-w-70",
                                            }: ProcessingModePartySelectorProps) {
    const visibleParties = useMemo(
        () =>
            role
                ? parties.filter(
                    (party) =>
                        party.roleType === role && (role !== "INITIATOR" || party.isHome),
                )
                : parties,
        [parties, role],
    );

    useEffect(() => {
        if (isDisabled || visibleParties.length === 0) return;
        const isValueVisible = value != null && visibleParties.some((party) => partyKeyOf(party) === value);
        if (isValueVisible) return;
        if (autoSelectSingle && visibleParties.length === 1) {
            onValueChange(visibleParties[0]);
        } else if (value) {
            onValueChange(null);
        }
    }, [autoSelectSingle, isDisabled, visibleParties, value, onValueChange]);

    const handleChange = (key: Key | null) => {
        onValueChange(visibleParties.find((party) => partyKeyOf(party) === key) ?? null);
    };

    return (
        <Select
            name={name}
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
                    {visibleParties.map((party) => {
                        const id = partyKeyOf(party);
                        return (
                            <ListBox.Item key={id} id={id} textValue={party.name}>
                                {showType ? (
                                    `${party.roleType} (${party.identifier} - ${party.identifierType} ${party.isHome ? " - Home" : ""})`
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


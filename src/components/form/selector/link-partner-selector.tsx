/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useEffect, useMemo } from "react";
import type { Key} from "@heroui/react";
import { FieldError, Label, ListBox, Select } from "@heroui/react";
import type { ConnectorLinkPartner } from "@/types/response/link-partner";

export interface LinkPartnerSelectorProps {
    partners: ConnectorLinkPartner[];
    name?: string;
    value?: string | null;
    onValueChange: (partner: ConnectorLinkPartner | null) => void;
    label?: string;
    onlyTestPartners?: boolean;
    autoSelectSingle?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}

const keyOf = (partner: ConnectorLinkPartner) => partner.name;

export function LinkPartnerSelector({
                                        partners,
                                        name,
                                        value,
                                        onValueChange,
                                        label = "Backend Name",
                                        onlyTestPartners = false,
                                        autoSelectSingle = true,
                                        isRequired = false,
                                        isDisabled = false,
                                        className = "min-w-70",
                                    }: LinkPartnerSelectorProps) {
    const visiblePartners = useMemo(
        () => (onlyTestPartners ? partners.filter((partner) => partner.testOnly) : partners),
        [partners, onlyTestPartners],
    );

    const singlePartner = visiblePartners.length === 1 ? visiblePartners[0] : null;

    useEffect(() => {
        if (!autoSelectSingle || isDisabled || !singlePartner) return;
        if (value === keyOf(singlePartner)) return; // already selected, avoids a loop
        onValueChange(singlePartner);
    }, [autoSelectSingle, isDisabled, singlePartner, value, onValueChange]);

    const handleChange = (key: Key | null) => {
        onValueChange(visiblePartners.find((partner) => keyOf(partner) === key) ?? null);
    };

    return (
        <Select
            name={name}
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
                    {visiblePartners.map((partner) => {
                        const id = keyOf(partner);
                        return (
                            <ListBox.Item key={id} id={id} textValue={partner.name}>
                                {partner.name}
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

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
import { useMemo, useState } from "react";
import { AttachmentType } from "@/types/global";

export const ALL_TYPES = "All" as const;

export type AttachmentTypesFilter = AttachmentType | typeof ALL_TYPES;

interface TypeOption {
    id: AttachmentTypesFilter;
    label: string;
}

const TYPE_OPTIONS: readonly TypeOption[] = [
    { id: "ATTACHMENT", label: "Attachment" },
    { id: "ASICS", label: "Asics" },
    { id: "BUSINESS_CONTENT", label: "Business content" },
    { id: "BUSINESS_DOCUMENT", label: "Business document" },
    { id: "DETACHED_SIGNATURE", label: "Detached signature" },
    { id: "EVIDENCE_XML", label: "Evidence XML" },
    { id: "PDF_TOKEN", label: "PDF Token" },
    { id: "XML_TOKEN", label: "XML Token" },
];

const ALL_OPTION: TypeOption = { id: ALL_TYPES, label: "All" };

export interface AttachmentTypesMultiSelectorProps {
    name?: string;
    values?: AttachmentTypesFilter[] | null;
    onValueChange: (values: AttachmentTypesFilter[]) => void;
    label?: string;
    isDisabled?: boolean;
    showAll?: boolean;
    className?: string;
}

export function AttachmentTypeMultiSelector({
                                                values,
                                                onValueChange,
                                                name,
                                                label = "Types",
                                                isDisabled = false,
                                                showAll = false,
                                                className = "min-w-70",
                                            }: AttachmentTypesMultiSelectorProps) {
    const [internal, setInternal] = useState<AttachmentTypesFilter[]>([]);
    const current = values ?? internal;

    const options = useMemo(
        () => (showAll ? [ALL_OPTION, ...TYPE_OPTIONS] : TYPE_OPTIONS),
        [showAll],
    );

    const handleChange = (next: Key | Key[] | null) => {
        let keys = (Array.isArray(next) ? next : next == null ? [] : [next]).map(
            String,
        ) as AttachmentTypesFilter[];

        // "All" is exclusive: picking it clears the rest, picking anything else clears it
        if (showAll) {
            const hadAll = current.includes(ALL_TYPES);
            keys =
                keys.includes(ALL_TYPES) && !hadAll
                    ? [ALL_TYPES]
                    : keys.filter((k) => k !== ALL_TYPES);
        }

        setInternal(keys);
        onValueChange(keys);
    };

    return (
        <Select
            name={name}
            selectionMode="multiple"
            value={current}
            onChange={handleChange}
            isDisabled={isDisabled}
            className={className}
            placeholder="Select types"
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

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
import { AttachmentStorageType } from "@/types/global";

export const ALL_TYPES = "All" as const;

export type AttachmentStoragesFilter = AttachmentStorageType | typeof ALL_TYPES;

interface TypeOption {
    id: AttachmentStoragesFilter;
    label: string;
}

const STORAGE_OPTIONS: readonly TypeOption[] = [
    { id: "S3_BUCKET", label: "S3 Bucket" }
];

const ALL_OPTION: TypeOption = { id: ALL_TYPES, label: "All" };

export interface AttachmentStorageMultiSelectorProps {
    name?: string;
    values?: AttachmentStoragesFilter[] | null;
    onValueChange: (values: AttachmentStoragesFilter[]) => void;
    label?: string;
    isDisabled?: boolean;
    showAll?: boolean;
    className?: string;
}

export function AttachmentStorageMultiSelector({
                                                   values,
                                                   onValueChange,
                                                   name,
                                                   label = "Storages",
                                                   isDisabled = false,
                                                   showAll = false,
                                                   className = "min-w-70",
                                               }: AttachmentStorageMultiSelectorProps) {
    const [internal, setInternal] = useState<AttachmentStoragesFilter[]>([]);
    const current = values ?? internal;

    const options = useMemo(
        () => (showAll ? [ALL_OPTION, ...STORAGE_OPTIONS] : STORAGE_OPTIONS),
        [showAll],
    );

    const handleChange = (next: Key | Key[] | null) => {
        let keys = (Array.isArray(next) ? next : next == null ? [] : [next]).map(
            String,
        ) as AttachmentStoragesFilter[];

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
            placeholder="Select storages"
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

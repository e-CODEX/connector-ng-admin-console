/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Label, SearchField } from "@heroui/react";
import { SearchCriteriaBox } from "@/components/form/search-criteria-box";
import type { AttachmentTypesFilter } from "@/components/form/selector/attachment-type-multi-selector";
import { AttachmentTypeMultiSelector } from "@/components/form/selector/attachment-type-multi-selector";
import type { AttachmentStoragesFilter } from "@/components/form/selector/attachment-storage-multi-selector";
import { AttachmentStorageMultiSelector } from "@/components/form/selector/attachment-storage-multi-selector";
import type { RangeValue } from "react-aria-components";
import type { ZonedDateTime } from "@internationalized/date";
import type { DateTimeRangeGranularity} from "@/components/form/selector/date-time-range-selector";
import { DateTimeRangeSelector } from "@/components/form/selector/date-time-range-selector";
import React from "react";

interface MessageFiltersPanelProps {
    messageIdentifier: string;
    filename: string;
    types: AttachmentTypesFilter[] | [];
    storages: AttachmentStoragesFilter[] | [];
    dateRange: RangeValue<ZonedDateTime> | null;
    dateGranularity: DateTimeRangeGranularity;
    onMessageIdentifierChange: (value: string) => void;
    onFilenameChange: (value: string) => void;
    onTypesChange: (types: AttachmentTypesFilter[] | []) => void;
    onStoragesChange: (storages: AttachmentStoragesFilter[] | []) => void;
    onDateRangeChange: (dateRange: RangeValue<ZonedDateTime> | null) => void;
    className?: string;
}

export function MessageFiltersPanel({
                                        messageIdentifier,
                                        filename,
                                        types,
                                        storages,
                                        dateRange,
                                        dateGranularity,
                                        onMessageIdentifierChange,
                                        onFilenameChange,
                                        onTypesChange,
                                        onStoragesChange,
                                        onDateRangeChange,
                                        className
                                    }: MessageFiltersPanelProps) {
    return (
        <SearchCriteriaBox className={className}>
            <SearchField className="w-full sm:max-w-xs" value={messageIdentifier} onChange={onMessageIdentifierChange}>
                <Label className="text-sm font-medium">Message Identifier</Label>
                <SearchField.Group>
                    <SearchField.SearchIcon/>
                    <SearchField.Input placeholder="Search by message identifier"/>
                    <SearchField.ClearButton/>
                </SearchField.Group>
            </SearchField>

            <SearchField className="w-full sm:max-w-xs" value={filename} onChange={onFilenameChange}>
                <Label className="text-sm font-medium">Filename</Label>
                <SearchField.Group>
                    <SearchField.SearchIcon/>
                    <SearchField.Input placeholder="Search by file name"/>
                    <SearchField.ClearButton/>
                </SearchField.Group>
            </SearchField>

            <AttachmentTypeMultiSelector
                values={types}
                showAll={true}
                onValueChange={onTypesChange}
            />

            <AttachmentStorageMultiSelector
                values={storages}
                showAll={true}
                onValueChange={onStoragesChange}
            />

            <DateTimeRangeSelector
                value={dateRange}
                granularity={dateGranularity}
                shouldForceLeadingZeros={true}
                onChange={(next) => onDateRangeChange(next as RangeValue<ZonedDateTime> | null)}
            />
        </SearchCriteriaBox>
    );
}

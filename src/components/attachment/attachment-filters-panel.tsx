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
import { AttachmentTypeMultiSelector, AttachmentTypesFilter } from "@/components/form/attachment-type-multi-selector";
import { AttachmentStorageMultiSelector, AttachmentStoragesFilter } from "@/components/form/attachment-storage-multi-selector";

interface MessageFiltersPanelProps {
    messageIdentifier: string;
    filename: string;
    types: AttachmentTypesFilter[] | [];
    storages: AttachmentStoragesFilter[] | [];
    onMessageIdentifierChange: (value: string) => void;
    onFilenameChange: (value: string) => void;
    onTypesChange: (types: AttachmentTypesFilter[] | []) => void;
    onStoragesChange: (storages: AttachmentStoragesFilter[] | []) => void;
    className?: string;
}

export function MessageFiltersPanel({
                                        messageIdentifier,
                                        filename,
                                        types,
                                        storages,
                                        onMessageIdentifierChange,
                                        onFilenameChange,
                                        onTypesChange,
                                        onStoragesChange,
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
        </SearchCriteriaBox>
    );
}

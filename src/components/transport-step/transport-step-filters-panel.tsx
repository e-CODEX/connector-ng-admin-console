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
import { TransportStepStatusesFilter, TransportStepStatusMultiSelector } from "@/components/form/transport-step-status-multi-selector";

interface TransportStepFiltersPanelProps {
    messageOrRemoteSystemIdentifier: string;
    linkPartnerName: string;
    statuses: TransportStepStatusesFilter[] | [];
    onMessageOrRemoteSystemIdentifierChange: (value: string) => void;
    onLinkPartnerNameChange: (value: string) => void;
    onStatusesChange: (statuses: TransportStepStatusesFilter[] | []) => void;
    className?: string;
}

export function TransportStepFiltersPanel({
                                              messageOrRemoteSystemIdentifier,
                                              linkPartnerName,
                                              statuses,
                                              onMessageOrRemoteSystemIdentifierChange,
                                              onLinkPartnerNameChange,
                                              onStatusesChange,
                                              className,
                                          }: TransportStepFiltersPanelProps) {
    return (
        <SearchCriteriaBox className={className}>
            <SearchField className="w-full sm:max-w-xs" value={messageOrRemoteSystemIdentifier}
                         onChange={onMessageOrRemoteSystemIdentifierChange}>
                <Label className="text-sm font-medium">Message or remote system
                    identifier</Label>
                <SearchField.Group>
                    <SearchField.SearchIcon/>
                    <SearchField.Input
                        placeholder="Search by message or remote system identifier"/>
                    <SearchField.ClearButton/>
                </SearchField.Group>
            </SearchField>

            <SearchField className="w-full sm:max-w-xs" value={linkPartnerName}
                         onChange={onLinkPartnerNameChange}>
                <Label className="text-sm font-medium">Link partner name</Label>
                <SearchField.Group>
                    <SearchField.SearchIcon/>
                    <SearchField.Input placeholder="Search by link partner name"/>
                    <SearchField.ClearButton/>
                </SearchField.Group>
            </SearchField>
            <TransportStepStatusMultiSelector
                values={statuses}
                showAll={true}
                onValueChange={onStatusesChange}
            />
        </SearchCriteriaBox>
    );
}

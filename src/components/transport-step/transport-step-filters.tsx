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

interface MessageFiltersProps {
    messageOrRemoteSystemIdentifier: string;
    linkPartnerName: string;
    onMessageOrRemoteSystemIdentifierChange: (value: string) => void;
    onLinkPartnerNameChange: (value: string) => void;
    className?: string;
}

export function TransportStepFilters({
                                         messageOrRemoteSystemIdentifier,
                                         linkPartnerName,
                                         onMessageOrRemoteSystemIdentifierChange,
                                         onLinkPartnerNameChange,
                                         className,
                                     }: MessageFiltersProps) {
    return (
        <section
            className={`mt-6 mb-4 rounded-xl border border-border bg-surface p-4 ${className ?? ""}`}>
            <h2 className="text-sm font-semibold text-foreground mb-3">Search criteria</h2>
            <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
        </section>
    );
}
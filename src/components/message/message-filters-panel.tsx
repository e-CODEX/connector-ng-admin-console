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
import { BusinessDomainSelector } from "@/components/form/business-domain-selector";
import { ProcessingModeServiceSelector } from "@/components/form/pmode-service-selector";
import { ConnectorProcessingModeService } from "@/types/response/processing-mode";
import { MessageDirectionSelector } from "@/components/form/message-direction-selector";

interface MessageFiltersPanelProps {
    identifier: string;
    backendName: string;
    direction: string;
    businessDomainIdentifier: string;
    processingModeService: string;
    businessDomainIdentifiers: string[];
    processingModesServices: ConnectorProcessingModeService[];
    onIdentifierChange: (value: string) => void;
    onBackendNameChange: (value: string) => void;
    onBusinessDomainIdentifierChange: (value: string) => void;
    onProcessingModesServiceChange: (service: ConnectorProcessingModeService | null) => void;
    onDirectionChange: (direction: string | null) => void;
    className?: string;
}

export function MessageFiltersPanel({
                                        identifier,
                                        backendName,
                                        direction,
                                        businessDomainIdentifier,
                                        processingModeService,
                                        businessDomainIdentifiers,
                                        processingModesServices,
                                        onIdentifierChange,
                                        onBackendNameChange,
                                        onBusinessDomainIdentifierChange,
                                        onProcessingModesServiceChange,
                                        onDirectionChange,
                                        className
                                    }: MessageFiltersPanelProps) {
    return (
        <SearchCriteriaBox className={className}>
            <SearchField className="w-full sm:max-w-xs" value={identifier} onChange={onIdentifierChange}>
                <Label className="text-sm font-medium">Identifier</Label>
                <SearchField.Group>
                    <SearchField.SearchIcon/>
                    <SearchField.Input placeholder="Search by identifier"/>
                    <SearchField.ClearButton/>
                </SearchField.Group>
            </SearchField>
            <SearchField className="w-full sm:max-w-xs" value={backendName} onChange={onBackendNameChange}>
                <Label className="text-sm font-medium">Backend name</Label>
                <SearchField.Group>
                    <SearchField.SearchIcon/>
                    <SearchField.Input placeholder="Search by backend name"/>
                    <SearchField.ClearButton/>
                </SearchField.Group>
            </SearchField>
            <MessageDirectionSelector
                value={direction}
                showAll={true}
                onValueChange={onDirectionChange}
            />
            <BusinessDomainSelector
                identifiers={businessDomainIdentifiers}
                value={businessDomainIdentifier}
                onValueChange={onBusinessDomainIdentifierChange}
            />
            <ProcessingModeServiceSelector
                services={processingModesServices}
                value={processingModeService}
                onValueChange={onProcessingModesServiceChange}
            />
        </SearchCriteriaBox>
    );
}

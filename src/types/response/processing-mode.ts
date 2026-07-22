/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { PartyRoleType } from "@/types/global";

export interface ConnectorProcessingModeResponse {
    uuid: string;
    description: string;
    filename: string;
    businessDomainIdentifier: string;
    createdAt: string;
    updatedAt: string;
}

export interface ConnectorProcessingModeDetailResponse extends ConnectorProcessingModeResponse {
    parties: ConnectorProcessingModeParty[];
    services: ConnectorProcessingModeService[];
    actions: ConnectorProcessingModeAction[];
}

export interface ConnectorProcessingModeParty {
    name: string;
    identifier: string;
    identifierType: string;
    role: string;
    roleType: PartyRoleType;
    isHome: boolean;
}

export interface ConnectorProcessingModeService {
    name: string;
    type: string;
}

export interface ConnectorProcessingModeAction {
    name: string;
}

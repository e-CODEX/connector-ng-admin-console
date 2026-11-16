/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { As4PropertiesRequest, PartyInfoRequest, OutboundMessageContent } from "@/types/request/message";

export type As4Selections = Pick<As4PropertiesRequest, "service" | "action" | "fromParty" | "toParty">;
export const emptyService = (): As4PropertiesRequest["service"] => ({ name: "", type: "" });

export const emptyAction = (): As4PropertiesRequest["action"] => ({ name: "" });

export const emptyParty = (): PartyInfoRequest => ({
    identifier: "",
    identifierType: "",
    role: "",
});

export const emptyAs4Selections = (): As4Selections => ({
    service: emptyService(),
    action: emptyAction(),
    fromParty: emptyParty(),
    toParty: emptyParty(),
});

export const emptyBusinessDocument = (): OutboundMessageContent => ({
    xmlContent: undefined,
    businessDocument: {
        aesType: "SIGNATURE_BASED",
        document: undefined,
        detachedSignature: undefined
    }
})

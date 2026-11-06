/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { requireUserOrDown } from "@/lib/session";
import OutboundMessageComponent from "@/components/message/outbound/outbound-message";
import { BackendDownScreen } from "@/components/common/backend-down-screen";

export default async function MessageOutboundPage() {
    const user = await requireUserOrDown();

    if (user === "down") {
        return <BackendDownScreen autoRetryMs={15_000}/>;
    }

    return <OutboundMessageComponent/>;
}

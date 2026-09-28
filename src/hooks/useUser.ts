/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useContext } from "react";
import { UserContext } from "@/app/providers";
import { ConnectorUser } from "@/types/response/user";

export function useOptionalUser(): ConnectorUser | null {
    return useContext(UserContext);
}

export function useUser(): ConnectorUser {
    const user = useOptionalUser();
    if (!user) throw new Error("useUser called outside an authenticated context");
    return user;
}

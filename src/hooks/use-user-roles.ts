/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useEffect, useState } from "react";
import { useUserService } from "@/hooks/use-http-service";
import { ConnectorUserRole } from "@/types/response/user";

type UserRolesState = {
    userRoles: ConnectorUserRole[];
    isLoading: boolean;
    error: Error | null;
};

export function useUserRoles() {
    const userService = useUserService();
    const [state, setState] = useState<UserRolesState>({
        userRoles: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;

        userService
            .listAllUserRoles()
            .then((roles) => {
                if (!cancelled) setState({ userRoles: roles, isLoading: false, error: null });
            })
            .catch((err) => {
                if (!cancelled) {
                    setState({
                        userRoles: [],
                        isLoading: false,
                        error: err instanceof Error ? err : new Error("Failed to load roles"),
                    });
                }
            });
        return () => {
            cancelled = true;
        };
    }, [userService]);

    return state;
}
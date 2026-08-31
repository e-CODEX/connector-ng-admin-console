/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorUser } from "@/types/response/user";
import { restApiCall } from "@/lib/rest";
import { UserCreationRequest } from "@/types/request/user";

export function createUserService(baseUrl: string) {
    return {
        async createUser(request: UserCreationRequest): Promise<ConnectorUser> {
            return restApiCall<ConnectorUser>(
                baseUrl,
                "api/v1/admin/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request)
                }
            )
        },
        async blockUser(identifier: string): Promise<ConnectorUser> {
            return restApiCall<ConnectorUser>(baseUrl, `api/v1/admin/users/${identifier}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ enabled: false })
            })
        },
        async listAllUsers(): Promise<ConnectorUser[]> {
            return restApiCall<ConnectorUser[]>(baseUrl, "api/v1/admin/users");
        },
        async deleteUser(identifier: string): Promise<void> {
            return restApiCall<void>(baseUrl, `api/v1/admin/users/${identifier}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
    }
}

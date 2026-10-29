/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorUser, ConnectorUserRole } from "@/types/response/user";
import { RestApiCall } from "@/lib/rest";
import { UserCreationRequest } from "@/types/request/user";

export function createUserService(baseUrl: string, call: RestApiCall) {
    return {
        async createUser(request: UserCreationRequest): Promise<ConnectorUser> {
            return call<ConnectorUser>(
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
        async updateUser(identifier: string, request: UserCreationRequest): Promise<ConnectorUser> {
            return call<ConnectorUser>(baseUrl, `api/v1/admin/users/${identifier}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request)
                }
            )
        },
        async listAllUsers(): Promise<ConnectorUser[]> {
            return call<ConnectorUser[]>(baseUrl, "api/v1/admin/users");
        },
        async listAllUserRoles(): Promise<ConnectorUserRole[]> {
            return call<ConnectorUserRole[]>(baseUrl, "api/v1/admin/users/roles");
        },
        async blockUser(identifier: string, username: string): Promise<ConnectorUser> {
            return call<ConnectorUser>(baseUrl, `api/v1/admin/users/${identifier}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, enabled: false })
            })
        },
        async deleteUser(identifier: string): Promise<void> {
            return call<void>(baseUrl, `api/v1/admin/users/${identifier}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        async assignRole(userId: string, role: string): Promise<void> {
            return call<void>(baseUrl, `api/v1/admin/users/${encodeURIComponent(userId)}/roles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: role,
            });
        },
        async unassignRole(userId: string, role: string): Promise<void> {
            return call<void>(baseUrl, `api/v1/admin/users/${encodeURIComponent(userId)}/roles`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: role,
            });
        },
    }
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorUser, LoginResponse } from "@/types/response/user";
import { RestApiCall } from "@/lib/rest";

export function createAuthService(baseUrl: string, call: RestApiCall) {
    return {
        async login(username: string, password: string): Promise<LoginResponse> {
            return call<LoginResponse>(baseUrl, "api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }),
                cache: "no-store",
            })
        },
        async logout(): Promise<void> {
            return call<void>(baseUrl, "api/v1/auth/logout", {
                headers: {
                    "Content-Type": "application/json"
                }
            });
        },
        async refreshToken(refreshToken: string): Promise<LoginResponse> {
            return call<LoginResponse>(baseUrl, "api/v1/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken }),
                cache: "no-store",
            })
        },
        async me(): Promise<ConnectorUser> {
            return call<ConnectorUser>(baseUrl, "api/v1/auth/me", {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        async editMe(username: string, email: string): Promise<ConnectorUser> {
            return call<ConnectorUser>(baseUrl, "api/v1/auth/me", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email }),
            })
        },
        async updatePasswordAfterLogin(currentPassword: string, newPassword: string, refreshToken?: string): Promise<void> {
            return call<void>(baseUrl, "api/v1/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentPassword, newPassword, refreshToken }),
            });
        },
    }
}

export type AuthService = ReturnType<typeof createAuthService>;

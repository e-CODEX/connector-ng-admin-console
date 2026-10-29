/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useUserService } from "@/hooks/use-http-service";

type RoleService = Pick<ReturnType<typeof useUserService>, "assignRole" | "unassignRole">;

export function diffRoles(current: readonly string[], desired: readonly string[]) {
    return {
        toAdd: desired.filter((r) => !current.includes(r)),
        toRemove: current.filter((r) => !desired.includes(r)),
    };
}

export async function applyRoleChanges(
    userService: RoleService,
    userId: string,
    { toAdd, toRemove }: { toAdd: string[]; toRemove: string[] },
): Promise<{ failedToAdd: string[]; failedToRemove: string[] }> {
    const failedToAdd: string[] = [];
    const failedToRemove: string[] = [];

    for (const role of toRemove) {
        try {
            await userService.unassignRole(userId, role);
        } catch {
            failedToRemove.push(role);
        }
    }
    for (const role of toAdd) {
        try {
            await userService.assignRole(userId, role);
        } catch {
            failedToAdd.push(role);
        }
    }
    return { failedToAdd, failedToRemove };
}
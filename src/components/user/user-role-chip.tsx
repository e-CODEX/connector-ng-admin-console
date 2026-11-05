/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

const ROLE_STYLES: Record<string, string> = {
    ROLE_ADMIN: "bg-red-700 text-white",
    ROLE_USER: "bg-sky-700 text-white",
    LOAD_TESTER: "bg-emerald-700 text-white",
};
const DEFAULT_ROLE_STYLE = "bg-amber-700 text-white";

const formatRole = (role: string) =>
    role.replace(/^ROLE_/, "").replace(/_/g, " ");

export function RoleChip({ role }: { role: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                ROLE_STYLES[role] ?? DEFAULT_ROLE_STYLE
            }`}
        >
            {formatRole(role)}
        </span>
    );
}

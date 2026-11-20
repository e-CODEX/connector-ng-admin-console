/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { toast } from "@heroui/react";
import type { ConnectorMessageStatsItem } from "@/types/response/stats";
import type { DownloadedFile } from "@/lib/rest";
import type { USER_ROLE } from "@/types/global";
import { ALL_SELECTOR } from "@/types/global";

import type { ConnectorUser } from "@/types/response/user";

export const truncate = (value: string, visibleChars = 36): string => {
    if (value == null) return "";
    return value.length > visibleChars ? `${value.slice(0, visibleChars)}\u2026` : value;
};

export function formatBytes(bytes: number, decimals = 1): string {
    if (!Number.isFinite(bytes) || bytes < 0) return "—";
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    const k = 1024;
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1);
    const value = bytes / Math.pow(k, i);

    // No decimals for whole bytes; trim trailing zeros otherwise
    const formatted = i === 0 ? String(value) : value.toFixed(decimals);
    return `${parseFloat(formatted)} ${units[i]}`;
}

const COUNT_FORMAT = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
    return COUNT_FORMAT.format(value);
}

export function asNumber(value: unknown): number {
    return typeof value === "number" ? value : 0;
}

export const toastSuccess = (message: string) => {
    toastMessage("Success", message, "success");
};

export function toastError(error: unknown, fallback = "An unexpected error occurred.") {
    toastErrorMessage(error instanceof Error ? error.message : fallback);
}

export const toastWarning = (message: string) => {
    toastMessage("Warning", message, "warning");
};

export const toastErrorMessage = (message: string) => {
    toastMessage("Error", message, "danger");
};

const toastMessage = (
    title: string,
    description: string,
    variant: "default" | "accent" | "success" | "warning" | "danger" | undefined,
) => {
    toast(title, {
        variant,
        description,
        actionProps: {
            children: "Dismiss",
            onPress: () => toast.clear(),
            variant: "tertiary",
        },
    });
};

export const deliveryRate = (s: ConnectorMessageStatsItem) =>
    s.total > 0 ? Math.round((s.delivered / s.total) * 1000) / 10 : 0;

export function saveFile({ blob, filename }: DownloadedFile): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Defer revocation: some browsers cancel the download if the URL dies too early.
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const cookieOptions = (maxAge?: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
});

export const asFilter = (value: string) =>
    value === ALL_SELECTOR || value === "*" || value === "" ? undefined : value;

export function hasRole(user: ConnectorUser | null | undefined, role: USER_ROLE): boolean {
    return user?.roles?.includes(role) ?? false;
}

export function isAdmin(user: ConnectorUser | null | undefined): boolean {
    return hasRole(user, "ROLE_ADMIN");
}

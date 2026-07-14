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
import { ConnectorMessageStatsItem } from "@/types/response/stats";
import { DownloadedFile } from "@/lib/rest";

export const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false,
    });
}

export const truncate = (s: string, n = 36) => {
    if (s == null) return "";
    return s.length > n ? `${s.slice(0, n)}…` : s;
}

export function formatBytes(bytes: number, decimals = 1): string {
    if (!Number.isFinite(bytes) || bytes < 0) return "—";
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    const k = 1024;
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(k)),
        units.length - 1,
    );
    const value = bytes / Math.pow(k, i);

    // No decimals for whole bytes; trim trailing zeros otherwise
    const formatted = i === 0 ? String(value) : value.toFixed(decimals);
    return `${parseFloat(formatted)} ${units[i]}`;
}

export function asNumber(value: unknown): number {
    return typeof value === "number" ? value : 0;
}

export const getDeliveryLabel = (isDelivered: boolean): string =>
    isDelivered ? "Delivered" : "Not delivered";

export const getBooleanColor = (value: boolean): "success" | "danger" =>
    value ? "success" : "danger";

export const getBooleanLabel = (value: boolean): string => (value ? "Yes" : "No");

export const getTransportDeliveryLabel = (status: string): string => {
    switch (status) {
        case "DELIVERED":
            return "Delivered";
        case "SUBMITTED":
            return "Submitted";
        case "DOWNLOADED":
            return "Downloaded";
        case "READY_FOR_DOWNLOAD":
            return "Ready for download";
        case "FAILED":
            return "Failed";
        default:
            return "Unknown";
    }
}

export const getTransportDeliveryColor = (status: string):
    "success" | "danger" | "warning" | "accent" | "default" => {
    switch (status) {
        case "DELIVERED":
            return "success";
        case "SUBMITTED":
            return "warning";
        case "DOWNLOADED":
            return "success";
        case "READY_FOR_DOWNLOAD":
            return "accent";
        case "FAILED":
            return "danger";
        default:
            return "default";
    }
}

export const toastSuccess = (message: string) => {
    toastMessage("Success", message, "success");
}

export function toastError(error: unknown, fallback = "An unexpected error occurred.") {
    toastErrorMessage(error instanceof Error ? error.message : fallback);
}

export const toastErrorMessage = (message: string) => {
    toastMessage("Error", message, "danger");
}

const toastMessage = (title: string, description: string, variant: "default" | "accent" | "success" | "warning" | "danger" | undefined) => {
    toast(title, {
        variant,
        description,
        actionProps: {
            children: "Dismiss",
            onPress: () => toast.clear(),
            variant: "tertiary",
        },
    });
}

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

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

export const getDeliveryLabel = (isDelivered: boolean): string =>
    isDelivered ? "Delivered" : "Not delivered";

export const getDeliveryColor = (isDelivered: boolean): "success" | "danger" =>
    isDelivered ? "success" : "danger";

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

export const toastSuccessMessage = (message: string) => {
    toastMessage("Success", message, "success");
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

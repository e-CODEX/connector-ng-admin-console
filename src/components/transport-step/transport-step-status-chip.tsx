/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { CheckCircle2, Download, HelpCircle, Inbox, Send, XCircle, } from "lucide-react";
import { Chip, Tooltip } from "@heroui/react";
import type { ComponentProps, ComponentType } from "react";
import { TransportStepStatus } from "@/types/global";

interface TransportDeliveryPresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "default" | "accent" | "success" | "warning" | "danger";
    variant: ComponentProps<typeof Chip>["variant"];
}

const UNKNOWN: TransportDeliveryPresentation = {
    label: "Unknown",
    description: "Unrecognised transport delivery status",
    icon: HelpCircle,
    color: "default",
    variant: "soft",
};

export const TRANSPORT_DELIVERY_STATUS: Record<TransportStepStatus, TransportDeliveryPresentation> = {
    SUBMITTED: {
        label: "Submitted",
        description: "Handed over for transport",
        icon: Send,
        color: "accent", // same as message "submitted"
        variant: "soft",
    },
    READY_FOR_DOWNLOAD: {
        label: "Ready for download",
        description: "Awaiting retrieval by the recipient",
        icon: Inbox,
        color: "warning", // waiting, like message "pending"
        variant: "soft",
    },
    DOWNLOADED: {
        label: "Downloaded",
        description: "Retrieved by the recipient",
        icon: Download,
        color: "accent", // in progress, not yet confirmed
        variant: "soft",
    },
    DELIVERED: {
        label: "Delivered",
        description: "Delivery confirmed",
        icon: CheckCircle2, // same as message "confirmed"
        color: "success",
        variant: "soft",
    },
    FAILED: {
        label: "Failed",
        description: "Transport failed",
        icon: XCircle, // same as message "rejected"
        color: "danger",
        variant: "soft",
    },
};

export const getTransportDeliveryPresentation = (status: string): TransportDeliveryPresentation =>
    TRANSPORT_DELIVERY_STATUS[status as TransportStepStatus] ?? UNKNOWN;

interface TransportDeliveryStatusChipProps {
    status: string;
    showLabel?: boolean;
}

export function TransportDeliveryStatusChip({ status, showLabel = true }: TransportDeliveryStatusChipProps) {
    const { label, description, icon: Icon, color, variant } = getTransportDeliveryPresentation(status);

    return (
        <Tooltip delay={200}>
            <Tooltip.Trigger>
                <span className="inline-flex" tabIndex={0}>
                    <Chip className="px-2" color={color} variant={variant} size="md" aria-label={description}>
                        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                        {showLabel && <Chip.Label>{label}</Chip.Label>}
                    </Chip>
                </span>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <Tooltip.Arrow />
                <p>{description}</p>
            </Tooltip.Content>
        </Tooltip>
    );
}

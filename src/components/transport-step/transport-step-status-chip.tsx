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
import type { TransportStepStatus } from "@/types/global";

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
        color: "accent",
        variant: "soft",
    },
    READY_FOR_PULL: {
        label: "Ready for pull",
        description: "Awaiting retrieval by the recipient",
        icon: Inbox,
        color: "warning",
        variant: "soft",
    },
    PULLED: {
        label: "Pulled",
        description: "Retrieved by the backend but not yet acknowledged",
        icon: Download,
        color: "accent",
        variant: "soft",
    },
    DELIVERED: {
        label: "Delivered",
        description: "Delivery confirmed",
        icon: CheckCircle2,
        color: "success",
        variant: "soft",
    },
    FAILED: {
        label: "Failed",
        description: "Transport failed",
        icon: XCircle,
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

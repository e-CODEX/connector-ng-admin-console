/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { CheckCircle, Download, HelpCircle, Inbox, Send, X, } from "lucide-react";
import { Chip } from "@heroui/react";
import type { ComponentType } from "react";
import { TransportStepStatus } from "@/types/global";
import { cn } from "@heroui/styles";

interface TransportDeliveryPresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    chipClass: string;
}

const UNKNOWN: TransportDeliveryPresentation = {
    label: "Unknown",
    description: "Unrecognised transport delivery status",
    icon: HelpCircle,
    chipClass: "chip--unknown",
};

export const TRANSPORT_DELIVERY_STATUS: Record<TransportStepStatus, TransportDeliveryPresentation> = {
    SUBMITTED: { label: "Submitted", description: "Handed over for transport", icon: Send, chipClass: "chip--submitted" },
    READY_FOR_DOWNLOAD: {
        label: "Ready for download",
        description: "Awaiting retrieval by the recipient",
        icon: Inbox,
        chipClass: "chip--ready-for-download"
    },
    DOWNLOADED: { label: "Downloaded", description: "Retrieved by the recipient", icon: Download, chipClass: "chip--downloaded" },
    DELIVERED: { label: "Delivered", description: "Delivery confirmed", icon: CheckCircle, chipClass: "chip--delivered" },
    FAILED: { label: "Failed", description: "Transport failed", icon: X, chipClass: "chip--failed" },
};

export const getTransportDeliveryPresentation = (status: string,): TransportDeliveryPresentation =>
    TRANSPORT_DELIVERY_STATUS[status as TransportStepStatus] ?? UNKNOWN;

interface TransportDeliveryStatusChipProps {
    status: string;
    showLabel?: boolean;
}

export function TransportDeliveryStatusChip({ status, showLabel = true, }: TransportDeliveryStatusChipProps) {
    const { label, description, icon: Icon, chipClass } = getTransportDeliveryPresentation(status);

    return (
        <Chip className={cn("chip--transport", chipClass)} size="md" aria-label={description}>
            <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
            {showLabel && <Chip.Label>{label}</Chip.Label>}
        </Chip>
    );
}

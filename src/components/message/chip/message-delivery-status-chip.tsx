/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { CheckCircle2, Clock, PackageCheck, Send, Trash2, XCircle } from "lucide-react";
import { Chip, Tooltip } from "@heroui/react";
import type { ComponentProps, ComponentType } from "react";
import { ConnectorMessage } from "@/types/response/message";
import { DateTime, formatDateTime } from "@/components/common/date-time";

export type DeliveryState =
    | "deleted"
    | "rejected"
    | "deliveredToBackend"
    | "confirmed"
    | "submitted"
    | "pending";

interface DeliveryPresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "danger" | "success" | "accent" | "warning";
    variant: ComponentProps<typeof Chip>["variant"];
}

export const DELIVERY_STATUS: Record<DeliveryState, DeliveryPresentation> = {
    deleted: {
        label: "Deleted",
        description: "The message files have been deleted",
        icon: Trash2,
        color: "danger",
        variant: "primary",
    },
    rejected: {
        label: "Rejected",
        description: "The message was rejected by the receiving connector",
        icon: XCircle,
        color: "danger",
        variant: "soft",
    },
    deliveredToBackend: {
        label: "Delivered",
        description: "The message was delivered to the backend system",
        icon: PackageCheck,
        color: "success",
        variant: "secondary",
    },
    confirmed: {
        label: "Confirmed",
        description: "Message received and acknowledged by the backend",
        icon: CheckCircle2,
        color: "success",
        variant: "soft",
    },
    submitted: {
        label: "Submitted",
        description: "The message was submitted to the gateway system",
        icon: Send,
        color: "accent",
        variant: "soft",
    },
    pending: {
        label: "Pending",
        description: "The message has not been delivered yet. See its transport steps",
        icon: Clock,
        color: "warning",
        variant: "soft",
    },
};

const hasTimestamp = (value?: string | null): value is string =>
    typeof value === "string" && value.trim().length > 0;

const GATEWAY_TO_BACKEND = "GATEWAY_TO_BACKEND";
const BACKEND_TO_GATEWAY = "BACKEND_TO_GATEWAY";

const FILES_DELETED_NOTE = "Its files have been deleted.";

export interface DeliveryResolution {
    state: DeliveryState;
    timestamp: string | null;
    /** True when the message reached a final state (rejected/confirmed) and its files were deleted afterwards. */
    filesDeleted: boolean;
}

/**
 * Resolves the delivery state of a message, in priority order:
 *  1. rejectedAt set                                               -> rejected (terminal), files deleted if deletedAt is also set
 *  2. confirmedAt set                                              -> confirmed (delivered), files deleted if deletedAt is also set
 *  3. deletedAt set (neither rejected nor confirmed)               -> deleted (terminal)
 *  4. GATEWAY_TO_BACKEND + deliveredToLinkPartnerAt set            -> delivered to the backend
 *  5. BACKEND_TO_GATEWAY + deliveredToLinkPartnerAt set
 *     (and not confirmed: no DELIVERY or RELAY_REMMD_ACCEPTANCE)   -> submitted to the gateway
 *  6. otherwise                                                    -> pending
 */
export const resolveDeliveryState = (message: ConnectorMessage): DeliveryResolution => {
    const { deletedAt, rejectedAt, confirmedAt, deliveredToLinkPartnerAt, updatedAt, direction } = message;
    const isDeleted = hasTimestamp(deletedAt);

    if (hasTimestamp(rejectedAt)) {
        return { state: "rejected", timestamp: rejectedAt, filesDeleted: isDeleted };
    }
    if (hasTimestamp(confirmedAt)) {
        return { state: "confirmed", timestamp: confirmedAt, filesDeleted: isDeleted };
    }
    if (hasTimestamp(deletedAt)) {
        // The "deleted" state already says it, no extra flag needed
        return { state: "deleted", timestamp: deletedAt, filesDeleted: false };
    }

    if (hasTimestamp(deliveredToLinkPartnerAt)) {
        if (direction === GATEWAY_TO_BACKEND) {
            return { state: "deliveredToBackend", timestamp: deliveredToLinkPartnerAt, filesDeleted: false };
        }
        if (direction === BACKEND_TO_GATEWAY) {
            return { state: "submitted", timestamp: deliveredToLinkPartnerAt, filesDeleted: false };
        }
    }

    return { state: "pending", timestamp: updatedAt, filesDeleted: false };
};

export const getDeliveryPresentation = (message: ConnectorMessage) => {
    const { state, timestamp, filesDeleted } = resolveDeliveryState(message);
    const presentation = DELIVERY_STATUS[state];

    return {
        state,
        timestamp,
        filesDeleted,
        ...presentation,
        description: filesDeleted ? `${presentation.description}. ${FILES_DELETED_NOTE}` : presentation.description,
    };
};

interface MessageDeliveryStatusChipProps {
    message: ConnectorMessage;
    showLabel?: boolean;
    showDate?: boolean;
}

export function MessageDeliveryStatusChip({
                                              message,
                                              showLabel = true,
                                              showDate = true,
                                          }: MessageDeliveryStatusChipProps) {
    const { label, description, icon: Icon, color, variant, timestamp, filesDeleted } =
              getDeliveryPresentation(message);

    const spokenDate = formatDateTime(timestamp, { precision: "minute", timeZone: "UTC" });
    const ariaLabel = spokenDate ? `${description} on ${spokenDate} UTC` : description;

    return (
        <Tooltip delay={200}>
            <Tooltip.Trigger>
                <span className="inline-flex" tabIndex={0}>
                    <Chip className="px-2" color={color} variant={variant} size="md" aria-label={ariaLabel}>
                        <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
                        {showLabel && <Chip.Label>{label}</Chip.Label>}
                        {showDate && timestamp && (
                            <Chip.Label className="opacity-70">
                                <DateTime value={timestamp} precision="millis" aria-hidden="true"/>
                            </Chip.Label>
                        )}
                        {filesDeleted && <Trash2 className="size-3.5 shrink-0 opacity-70" aria-hidden="true"/>}
                    </Chip>
                </span>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <Tooltip.Arrow/>
                <p>{description}</p>
            </Tooltip.Content>
        </Tooltip>
    );
}

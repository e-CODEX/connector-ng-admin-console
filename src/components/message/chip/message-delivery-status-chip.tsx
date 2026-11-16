/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { CheckCheck, CheckCircle2, Clock, PackageCheck, Send, Trash2, XCircle } from "lucide-react";
import { Chip, Tooltip } from "@heroui/react";
import type { ComponentProps, ComponentType } from "react";
import type { ConnectorMessage } from "@/types/response/message";
import { DateTime, formatDateTime } from "@/components/common/date-time";
import type { ConnectorMessageStatus } from "@/types/global";


export type DeliveryState =
    | "deleted"
    | "rejected"
    | "deliveredToBackend"
    | "confirmed"
    | "submitted"
    | "receivedByOppositeConnector"
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
    receivedByOppositeConnector: {
        label: "Received",
        description: "The message was received by the opposite connector",
        icon: CheckCheck,
        color: "accent",
        variant: "soft",
    },
    pending: {
        label: "Pending",
        description: "Not been delivered yet",
        icon: Clock,
        color: "warning",
        variant: "soft",
    },
};

const hasTimestamp = (value?: string | null): value is string =>
    typeof value === "string" && value.trim().length > 0;

const GATEWAY_TO_BACKEND = "GATEWAY_TO_BACKEND";
const BACKEND_TO_GATEWAY = "BACKEND_TO_GATEWAY";
const RECEIVED_BY_OPPOSITE_CONNECTOR: ConnectorMessageStatus = "RECEIVED_BY_OPPOSITE_CONNECTOR";

const FILES_DELETED_NOTE = "Its files have been deleted.";
const SEE_TRANSPORT_STEPS = "See its transport steps";

/** Extra context shown when a message is "pending", based on its backend status. */
const PENDING_CONTEXT: Partial<Record<ConnectorMessageStatus, string>> = {
    CREATED: "The message was created and is waiting to be processed",
    SUBMITTED: "The message was submitted and is waiting for the next transport step",
    READY_FOR_PULL: "The message is ready and waiting to be pulled by the backend",
    PULLED: "The message was pulled by the backend and is waiting for confirmation",
    RECEIVED_BY_OPPOSITE_CONNECTOR: "The message reached the opposite connector and is waiting to be delivered",
    DELIVERED: "Delivery was reported but has not been confirmed yet",
    FAILED: "Processing failed",
};

/** Short label shown on the chip next to "Pending", so the exact status is visible without hovering. */
const PENDING_STATUS_LABEL: Partial<Record<ConnectorMessageStatus, string>> = {
    CREATED: "Created",
    SUBMITTED: "Submitted",
    READY_FOR_PULL: "Ready for pull",
    PULLED: "Pulled",
    RECEIVED_BY_OPPOSITE_CONNECTOR: "At opposite connector",
    DELIVERED: "Delivered, not ack",
};

const STATUS_MISMATCH_LABEL = "Status mismatch";

/** Statuses that should have a matching timestamp: reaching "pending" with one of them is inconsistent data. */
const INCONSISTENT_PENDING_STATUSES: ConnectorMessageStatus[] = ["CONFIRMED", "REJECTED", "DELETED"];

const getPendingStatusLabel = (status?: ConnectorMessageStatus | null): string | null => {
    if (!status) {
        return null;
    }
    if (INCONSISTENT_PENDING_STATUSES.includes(status)) {
        return STATUS_MISMATCH_LABEL;
    }
    return PENDING_STATUS_LABEL[status] ?? null;
};

const getPendingContext = (status?: ConnectorMessageStatus | null): string | null => {
    if (!status) {
        return null;
    }
    if (INCONSISTENT_PENDING_STATUSES.includes(status)) {
        return `Its status is ${status}, but the matching timestamp is missing`;
    }
    return PENDING_CONTEXT[status] ?? null;
};

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
 *  4. status RECEIVED_BY_OPPOSITE_CONNECTOR + deliveredToLinkPartnerAt set
 *     (rejectedAt, confirmedAt and deletedAt are all unset here)   -> received by the opposite connector
 *  5. GATEWAY_TO_BACKEND + deliveredToLinkPartnerAt set            -> delivered to the backend
 *  6. BACKEND_TO_GATEWAY + deliveredToLinkPartnerAt set
 *     (and not confirmed: no DELIVERY or RELAY_REMMD_ACCEPTANCE)   -> submitted to the gateway
 *  7. otherwise                                                    -> pending
 *     (getDeliveryPresentation refines the pending description and color using message.status)
 */
export const resolveDeliveryState = (message: ConnectorMessage): DeliveryResolution => {
    const { deletedAt, rejectedAt, confirmedAt, deliveredToLinkPartnerAt, updatedAt, direction, status } = message;
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
        // Terminal timestamps were handled above, so none of them is set at this point
        if (status === RECEIVED_BY_OPPOSITE_CONNECTOR) {
            return { state: "receivedByOppositeConnector", timestamp: deliveredToLinkPartnerAt, filesDeleted: false };
        }
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
    let presentation: DeliveryPresentation = DELIVERY_STATUS[state];
    let description = presentation.description;

    if (state === "pending") {
        const context = getPendingContext(message.status);
        description = context
            ? `${description}. ${context}. ${SEE_TRANSPORT_STEPS}`
            : `${description}. ${SEE_TRANSPORT_STEPS}`;

        if (message.status === "FAILED") {
            // Keep the pending clock icon, only the label and color change
            presentation = { ...presentation, label: "Failed", color: "danger" };
        } else {
            // No "Pending" word: the clock icon says it, the label shows the exact status (empty if unknown)
            presentation = { ...presentation, label: getPendingStatusLabel(message.status) ?? "" };
        }
    } else if (filesDeleted) {
        description = `${description}. ${FILES_DELETED_NOTE}`;
    }

    return {
        state,
        timestamp,
        filesDeleted,
        ...presentation,
        description,
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
                        {showLabel && label && <Chip.Label>{label}</Chip.Label>}
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


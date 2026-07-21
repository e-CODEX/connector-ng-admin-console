/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { CheckCircle2, Clock, Send, XCircle } from "lucide-react";
import { Chip } from "@heroui/react";
import type { ComponentType } from "react";
import { ConnectorMessage } from "@/types/response/message";
import { formatDate } from "@/utils";

type DeliveryState =
    | "rejected"
    | "confirmed"
    | "deliveredToLinkPartner"
    | "pending";

interface DeliveryPresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "danger" | "success" | "accent" | "warning";
}

export const DELIVERY_STATUS: Record<DeliveryState, DeliveryPresentation> = {
    rejected: {
        label: "Not Delivered",
        description: "The message was rejected",
        icon: XCircle,
        color: "danger",
    },
    confirmed: {
        label: "Delivered",
        description: "The message was confirmed",
        icon: CheckCircle2,
        color: "success",
    },
    deliveredToLinkPartner: {
        label: "Submitted",
        description: "The message was delivered to the link partner",
        icon: Send,
        color: "accent",
    },
    pending: {
        label: "Pending",
        description: "The message has not been delivered yet",
        icon: Clock,
        color: "warning",
    },
};

const hasTimestamp = (value?: string | null): value is string =>
    typeof value === "string" && value.trim().length > 0;

/**
 * Resolves the delivery state of a message. A rejection is terminal, so it wins
 * over a confirmation, which itself wins over the link-partner delivery.
 */
export const getDeliveryPresentation = (message: ConnectorMessage) => {
    const state: DeliveryState = hasTimestamp(message.rejectedAt)
        ? "rejected"
        : hasTimestamp(message.confirmedAt)
            ? "confirmed"
            : hasTimestamp(message.deliveredToLinkPartnerAt)
                ? "deliveredToLinkPartner"
                : "pending";

    const timestamp = state === "rejected"
        ? message.rejectedAt
        : state === "confirmed"
            ? message.confirmedAt
            : state === "deliveredToLinkPartner"
                ? message.deliveredToLinkPartnerAt
                : null;

    return { state, timestamp: timestamp ?? null, ...DELIVERY_STATUS[state] };
};

interface MessageDeliveryStatusChipProps {
    message: ConnectorMessage;
    showLabel?: boolean;
    showDate?: boolean;
    locale?: string;
}

export function MessageDeliveryStatusChip({ message, showLabel = true, showDate = true }: MessageDeliveryStatusChipProps) {
    const {
              label,
              description,
              icon: Icon,
              color,
              timestamp,
          } = getDeliveryPresentation(message);

    const formattedDate = timestamp ? formatDate(timestamp) : null;
    const ariaLabel = formattedDate
        ? `${description} on ${formattedDate}`
        : description;

    return (
        <Chip
            className="px-2"
            color={color}
            variant="soft"
            size="md"
            aria-label={ariaLabel}
        >
            <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
            {showLabel && <Chip.Label>{label}</Chip.Label>}
            {showDate && formattedDate && (
                <Chip.Label className="opacity-70">{formattedDate}</Chip.Label>
            )}
        </Chip>
    );
}


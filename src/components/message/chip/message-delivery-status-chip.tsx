/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { CheckCircle2, Clock } from "lucide-react";
import { Chip } from "@heroui/react";
import type { ComponentType } from "react";

interface DeliveryPresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "success" | "warning";
}

export const DELIVERY_STATUS: Record<"true" | "false", DeliveryPresentation> = {
    true: {
        label: "Delivered",
        description: "The message was delivered",
        icon: CheckCircle2,
        color: "success",
    },
    false: {
        label: "Not delivered",
        description: "The message has not been delivered",
        icon: Clock,
        color: "warning",
    },
};

export const getDeliveryPresentation = (isDelivered: boolean) =>
    DELIVERY_STATUS[isDelivered ? "true" : "false"];

interface DeliveryStatusChipProps {
    isDelivered: boolean;
    showLabel?: boolean;
}

export function MessageDeliveryStatusChip({ isDelivered, showLabel = true, }: DeliveryStatusChipProps) {
    const { label, description, icon: Icon, color } = getDeliveryPresentation(isDelivered);

    return (
        <Chip className="px-2" color={color} variant="soft" size="md" aria-label={description}>
            <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
            {showLabel && <Chip.Label>{label}</Chip.Label>}
        </Chip>
    );
}

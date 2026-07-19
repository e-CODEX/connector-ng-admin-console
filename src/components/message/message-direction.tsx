/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Chip } from "@heroui/react";
import type { ComponentType } from "react";
import { MessageDirection } from "@/types/global";

interface DirectionPresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "warning" | "accent";
}

export const MESSAGE_DIRECTION: Record<MessageDirection, DirectionPresentation> = {
    BACKEND_TO_GATEWAY: {
        label: "Outbound",
        description: "Sent from the backend to the gateway",
        icon: ArrowUpRight,
        color: "warning",
    },
    GATEWAY_TO_BACKEND: {
        label: "Inbound",
        description: "Received from the gateway by the backend",
        icon: ArrowDownLeft,
        color: "accent",
    },
};

interface MessageDirectionChipProps {
    direction: MessageDirection;
    showLabel?: boolean;
}

export function MessageDirectionChip({ direction, showLabel = true, }: MessageDirectionChipProps) {
    const { label, description, icon: Icon, color } = MESSAGE_DIRECTION[direction];

    return (
        <Chip className="pe-2" color={color} variant="soft" size="sm" aria-label={description}>
            <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
            {showLabel && <span>{label}</span>}
        </Chip>
    );
}

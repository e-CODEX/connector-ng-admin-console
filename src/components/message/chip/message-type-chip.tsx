/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { FileText, ShieldCheck } from "lucide-react";
import { Chip } from "@heroui/react";
import type { ComponentType } from "react";
import type { TransportStepMessageType } from "@/types/global";

interface MessageTypePresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "default" | "accent";
}

export const TRANSPORT_STEP_MESSAGE_TYPE: Record<TransportStepMessageType, MessageTypePresentation> = {
    BUSINESS: {
        label: "Business",
        description: "Business payload message",
        icon: FileText,
        color: "accent",
    },
    EVIDENCE: {
        label: "Evidence",
        description: "REM evidence message",
        icon: ShieldCheck,
        color: "default",
    },
};

interface TransportStepMessageTypeChipProps {
    messageType: TransportStepMessageType;
    showLabel?: boolean;
}

export function TransportStepMessageTypeChip({ messageType, showLabel = true, }: TransportStepMessageTypeChipProps) {
    const stepMessageType = TRANSPORT_STEP_MESSAGE_TYPE[messageType];

    if (!stepMessageType) {
        return <Chip variant="primary" size="sm">Unknown</Chip>;
    }

    const { label, description, icon: Icon, color } = stepMessageType;

    return (
        <Chip className="px-2" color={color} variant="primary" size="md" aria-label={description}>
            <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
            {showLabel && <span>{label}</span>}
        </Chip>
    );
}

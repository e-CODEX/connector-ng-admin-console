/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Chip } from "@heroui/react";
import { CircleCheck, CircleX, type LucideIcon, MailCheck, MailOpen, MailWarning, MailX, TriangleAlert, } from "lucide-react";
import type { ComponentProps } from "react";
import { ConnectorEvidenceType } from "@/types/global";

type ChipColor = NonNullable<ComponentProps<typeof Chip>["color"]>;
type ChipVariant = NonNullable<ComponentProps<typeof Chip>["variant"]>;
type ChipSize = NonNullable<ComponentProps<typeof Chip>["size"]>;

interface EvidenceTypePresentation {
    readonly label: string;
    readonly color: ChipColor;
    readonly Icon: LucideIcon;
}

const EVIDENCE_TYPE_PRESENTATION: Record<
    ConnectorEvidenceType,
    EvidenceTypePresentation
> = {
    SUBMISSION_ACCEPTANCE: { label: "Submission accepted", color: "success", Icon: CircleCheck },
    SUBMISSION_REJECTION: { label: "Submission rejected", color: "danger", Icon: CircleX },
    RELAY_REMMD_ACCEPTANCE: { label: "Relay accepted", color: "success", Icon: CircleCheck },
    RELAY_REMMD_REJECTION: { label: "Relay rejected", color: "danger", Icon: CircleX },
    RELAY_REMMD_FAILURE: { label: "Relay failed", color: "warning", Icon: TriangleAlert },
    DELIVERY: { label: "Delivered", color: "success", Icon: MailCheck },
    NON_DELIVERY: { label: "Not delivered", color: "danger", Icon: MailX },
    RETRIEVAL: { label: "Retrieved", color: "success", Icon: MailOpen },
    NON_RETRIEVAL: { label: "Not retrieved", color: "warning", Icon: MailWarning },
};

const ICON_SIZE: Record<ChipSize, number> = {
    sm: 14,
    md: 16,
    lg: 18,
};

export interface EvidenceTypeChipProps {
    type: ConnectorEvidenceType;
    variant?: ChipVariant;
    size?: ChipSize;
    hideIcon?: boolean;
    className?: string;
}

export function EvidenceTypeChip({ type, variant = "soft", size = "sm", hideIcon = false, className, }: EvidenceTypeChipProps) {
    const { label, color, Icon } = EVIDENCE_TYPE_PRESENTATION[type];

    return (
        <Chip color={color} variant={variant} size={size} className={className}>
            {!hideIcon && (
                <Icon aria-hidden="true" size={ICON_SIZE[size]} className="shrink-0"/>
            )}
            <Chip.Label>{label}</Chip.Label>
        </Chip>
    );
}

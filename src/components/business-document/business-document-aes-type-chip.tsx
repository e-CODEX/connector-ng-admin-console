/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client";

import { Chip } from "@heroui/react";
import { CircleHelp, FileSignature, KeyRound, type LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { BusinessDocumentAesType } from "@/types/global";

type ChipProps = ComponentProps<typeof Chip>;

interface AesTypePresentation {
    label: string;
    color: NonNullable<ChipProps["color"]>;
    icon: LucideIcon;
}

const AES_TYPE_PRESENTATION: Record<BusinessDocumentAesType, AesTypePresentation> = {
    SIGNATURE_BASED: {
        label: "Signature based",
        color: "danger",
        icon: FileSignature,
    },
    AUTHENTICATION_BASED: {
        label: "Authentication based",
        color: "success",
        icon: KeyRound,
    },
};

const UNKNOWN_PRESENTATION: AesTypePresentation = {
    label: "Unknown",
    color: "default",
    icon: CircleHelp,
};

export interface BusinessDocumentAesTypeChipProps {
    aesType: BusinessDocumentAesType | null | undefined;
    size?: ChipProps["size"];
    variant?: ChipProps["variant"];
    showIcon?: boolean;
    className?: string;
}

export function BusinessDocumentAesTypeChip({ aesType, size = "sm", variant = "primary", showIcon = true, className, }
                                            : BusinessDocumentAesTypeChipProps) {
    const { label, color, icon: Icon } =
          (aesType && AES_TYPE_PRESENTATION[aesType]) ?? UNKNOWN_PRESENTATION;

    return (
        <Chip color={color} variant={variant} size={size} className={`px-2 py-0.5 ${className}`}>
            {showIcon ? <Icon aria-hidden className="size-3.5 shrink-0"/> : null}
            <Chip.Label className="font-semibold">{label}</Chip.Label>
        </Chip>
    );
}

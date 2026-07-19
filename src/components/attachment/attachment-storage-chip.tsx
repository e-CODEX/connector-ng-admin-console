/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Cloud, HardDrive, HelpCircle } from "lucide-react";
import { Chip } from "@heroui/react";
import type { ComponentType } from "react";
import { AttachmentStorageType } from "@/types/global";

interface AttachmentTypePresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "accent" | "default";
}

const UNKNOWN: AttachmentTypePresentation = {
    label: "Unknown",
    description: "Unrecognised attachment storage type",
    icon: HelpCircle,
    color: "default",
};

export const ATTACHMENT_TYPE: Record<AttachmentStorageType, AttachmentTypePresentation> = {
    S3_BUCKET: {
        label: "S3 bucket",
        description: "Stored in an S3-compatible object store",
        icon: Cloud,
        color: "accent",
    },
    LOCAL_FILE_SYSTEM: {
        label: "Local file system",
        description: "Stored on the connector file system",
        icon: HardDrive,
        color: "default",
    },
};

export const getAttachmentTypePresentation = (
    type: string,
): AttachmentTypePresentation =>
    ATTACHMENT_TYPE[type as AttachmentStorageType] ?? UNKNOWN;

interface AttachmentTypeChipProps {
    type: string;
    showLabel?: boolean;
}

export function AttachmentStorageChip({ type, showLabel = true, }: AttachmentTypeChipProps) {
    const { label, description, icon: Icon, color } = getAttachmentTypePresentation(type);

    return (
        <Chip
            className="px-2 text-white [&_svg]:text-inherit"
            color={color}
            variant="primary"
            size="md"
            aria-label={description}
        >
            <Icon className="size-3.5 shrink-0" aria-hidden="true"/>
            {showLabel && <Chip.Label className="text-inherit">{label}</Chip.Label>}
        </Chip>
    );
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { CheckCircle2, Trash2 } from "lucide-react";
import { Chip, Tooltip } from "@heroui/react";
import type { ComponentProps, ComponentType } from "react";
import { DateTime } from "@/components/common/date-time";

type AttachmentStatus = "ACTIVE" | "DELETED";

interface AttachmentStatusPresentation {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    color: "default" | "accent" | "success" | "warning" | "danger";
    variant: ComponentProps<typeof Chip>["variant"];
}

export const ATTACHMENT_STATUS: Record<AttachmentStatus, AttachmentStatusPresentation> = {
    ACTIVE: {
        label: "Available",
        description: "Attachment is available",
        icon: CheckCircle2,
        color: "success",
        variant: "soft",
    },
    DELETED: {
        label: "Deleted",
        description: "Attachment has been deleted",
        icon: Trash2,
        color: "danger",
        variant: "soft",
    },
};

export const getAttachmentStatus = (deletedAt?: string | null): AttachmentStatus =>
    deletedAt ? "DELETED" : "ACTIVE";

export const getAttachmentStatusPresentation = (deletedAt?: string | null): AttachmentStatusPresentation =>
    ATTACHMENT_STATUS[getAttachmentStatus(deletedAt)];

interface AttachmentStatusChipProps {
    deletedAt?: string | null;
    showLabel?: boolean;
    showDeletedAt?: boolean;
}

export function AttachmentStatusChip({
                                         deletedAt,
                                         showLabel = true,
                                         showDeletedAt = false,
                                     }: AttachmentStatusChipProps) {
    const { label, description, icon: Icon, color, variant } = getAttachmentStatusPresentation(deletedAt);

    return (
        <Tooltip delay={200}>
            <Tooltip.Trigger>
                <span className="inline-flex" tabIndex={0}>
                    <Chip
                        className="px-2"
                        color={color}
                        variant={variant}
                        size="md"
                        aria-label={deletedAt ? `${description} on ${deletedAt}` : description}
                    >
                        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                        {showLabel && <Chip.Label>{label}</Chip.Label>}
                        {deletedAt && showDeletedAt && (
                            <Chip.Label>
                                <DateTime value={deletedAt} precision="second" />
                            </Chip.Label>
                        )}
                    </Chip>
                </span>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <Tooltip.Arrow />
                <p>{description}</p>
                {deletedAt && (
                    <p>
                        <DateTime value={deletedAt} precision="second" />
                    </p>
                )}
            </Tooltip.Content>
        </Tooltip>
    );
}

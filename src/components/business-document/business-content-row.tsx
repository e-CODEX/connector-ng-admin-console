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

import { Button, Tooltip } from "@heroui/react";
import { Download, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { AttachmentStatusChip } from "@/components/attachment/attachment-status-chip";

export interface BusinessArtifactRowProps {
    icon: LucideIcon;
    name: string;
    meta: string;
    badge?: ReactNode;
    /** When provided (even null), the attachment status chip is shown. Omit to hide it. */
    deletedAt?: string | null;
    /** Show the deletion datetime inline in the chip (always in tooltip). */
    showDeletedAt?: boolean;
    isNested?: boolean;
    onDetailsPress?: () => void;
    onDownloadPress?: () => void;
}

export function BusinessContentRow({
                                       icon: Icon,
                                       name,
                                       meta,
                                       badge,
                                       deletedAt,
                                       showDeletedAt = false,
                                       isNested = false,
                                       onDetailsPress,
                                       onDownloadPress,
                                   }: BusinessArtifactRowProps) {
    // `undefined` = not an attachment row; `null` or a string = attachment with known status
    const showAttachmentStatus = deletedAt !== undefined;

    return (
        <div
            className={[
                "flex items-center gap-3 px-4 py-3",
                isNested ? "border-t pl-10" : "border-t first:border-t-0",
            ].join(" ")}
        >
            <Icon aria-hidden className="size-5 shrink-0 text-default-500"/>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="truncate text-sm">{name}</span>
                    {badge}
                    {showAttachmentStatus && (
                        <AttachmentStatusChip deletedAt={deletedAt} showDeletedAt={showDeletedAt}/>
                    )}
                </div>
                <p className="truncate text-xs text-default-500">{meta}</p>
            </div>

            {onDetailsPress ? (
                <Button size="sm" variant="secondary" onPress={onDetailsPress}>
                    Details
                </Button>
            ) : null}

            {onDownloadPress ? (
                <Tooltip delay={0}>
                    <Button isIconOnly size="sm" variant="tertiary" aria-label={`Download ${name}`} onPress={onDownloadPress}>
                        <Download/>
                    </Button>
                    <Tooltip.Content showArrow>
                        <Tooltip.Arrow/>
                        <p>Download</p>
                    </Tooltip.Content>
                </Tooltip>
            ) : null}
        </div>
    );
}

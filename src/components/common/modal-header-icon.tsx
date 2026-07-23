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

import { cn, Modal } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

const TONE_CLASSES = {
    default: "bg-default-soft text-default-soft-foreground",
    accent: "bg-accent-soft text-accent-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    danger: "bg-danger-soft text-danger-soft-foreground",
} as const;

export type ModalHeaderIconTone = keyof typeof TONE_CLASSES;

interface ModalHeaderIconProps
    extends Omit<ComponentProps<typeof Modal.Icon>, "children"> {
    icon: LucideIcon;
    tone?: ModalHeaderIconTone;
}

export function ModalHeaderIcon({ icon: Icon, tone = "accent", className, ...props }: ModalHeaderIconProps) {
    return (
        <Modal.Icon className={cn(TONE_CLASSES[tone], className)} {...props}>
            <Icon className="size-5" aria-hidden/>
        </Modal.Icon>
    );
}

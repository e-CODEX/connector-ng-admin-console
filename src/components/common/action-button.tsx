/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Button, Tooltip } from "@heroui/react";
import { Eye } from "lucide-react";
import React, { ComponentProps, ComponentType } from "react";

interface DetailButtonProps
    extends Omit<ComponentProps<typeof Button>, "isIconOnly" | "children"> {
    label?: string;
    icon?: ComponentType<{ className?: string }>;
}

export function ActionButton({
                                 label = "Details",
                                 icon: Icon = Eye,
                                 size = "sm",
                                 variant = "tertiary",
                                 ...buttonProps
                             }: DetailButtonProps) {
    return (
        <Tooltip delay={0}>
            <Button
                isIconOnly
                size={size}
                variant={variant}
                aria-label={label}
                {...buttonProps}
            >
                <Icon className="size-4 text-accent"/>
            </Button>
            <Tooltip.Content showArrow>
                <Tooltip.Arrow/>
                <p>{label}</p>
            </Tooltip.Content>
        </Tooltip>
    );
}

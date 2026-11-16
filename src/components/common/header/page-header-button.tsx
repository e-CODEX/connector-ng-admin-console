/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ButtonProps} from "@heroui/react";
import { Button, Tooltip } from "@heroui/react";
import type { ComponentType } from "react";
import React from "react";

interface PageHeaderButtonProps extends Omit<ButtonProps, "children"> {
    icon: ComponentType<{ className?: string }>;
    isSpinning?: boolean;
    tooltip?: string;
}

export function PageHeaderButton({ icon: Icon, isSpinning = false, tooltip, ...props }: PageHeaderButtonProps) {
    const button = (
        <Button isIconOnly size="lg" aria-label={tooltip} {...props}>
            <Icon className={`size-4 ${isSpinning ? "animate-spin" : ""}`}/>
        </Button>
    );

    if (!tooltip) {
        return button;
    }

    return (
        <Tooltip delay={0}>
            {button}
            <Tooltip.Content>{tooltip}</Tooltip.Content>
        </Tooltip>
    );
}

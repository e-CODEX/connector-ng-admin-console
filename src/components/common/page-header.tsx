/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Typography } from "@heroui/react";
import React, { type ComponentType } from "react";

interface PageHeaderProps {
    title: string;
    icon: ComponentType<{ className?: string }>;
    subtitle?: string;
    className?: string;
    children?: React.ReactNode;
}

export function PageHeader({ title, icon: Icon, subtitle, className, children }: PageHeaderProps) {
    return (
        <div className={`flex items-center gap-3.5 ${className ?? "mb-6"}`}>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
                <Icon className="size-6 text-accent"/>
            </div>
            <div>
                <Typography.Heading level={1}
                                    className="text-3xl font-semibold tracking-tight leading-tight">
                    {title}
                </Typography.Heading>
                {subtitle && <span className="text-sm text-muted">{subtitle}</span>}
            </div>
            {children && (
                <div className="ml-auto flex items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}

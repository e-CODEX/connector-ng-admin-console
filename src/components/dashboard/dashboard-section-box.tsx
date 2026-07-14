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
import { Icon } from "@iconify/react";
import { type ReactNode } from "react";

interface DashboardSectionBoxProps {
    title: string;
    subtitle?: string;
    icon?: string;
    children: ReactNode;
}

export function DashboardSectionBox({ title, subtitle, icon, children }: DashboardSectionBoxProps) {
    return (
        <section className="flex flex-col rounded-lg border border-default-200 bg-default-50 mb-1">
            <div className="flex items-center gap-3 px-4 py-1">
                {icon && (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-medium bg-default-100 text-foreground">
                        <Icon icon={icon} className="size-5"/>
                    </span>
                )}
                <div className="flex flex-col">
                    <Typography.Heading level={4} weight="semibold" className="text-slate-700">
                        {title}
                    </Typography.Heading>
                    {subtitle && (
                        <Typography.Paragraph size="sm" color="muted">
                            {subtitle}
                        </Typography.Paragraph>
                    )}
                </div>
            </div>
            <div className="p-3">
                {children}
            </div>
        </section>
    );
}

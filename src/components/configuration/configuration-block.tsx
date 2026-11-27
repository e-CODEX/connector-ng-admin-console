/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Surface } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ConfigurationBlockProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    aside?: ReactNode;
    children: ReactNode;
}

export function ConfigurationBlock({ title, description, icon: Icon, aside, children }: ConfigurationBlockProps) {
    return (
        <Surface className="rounded-xl p-4 sm:p-5">
            <header className="mb-3 flex items-start gap-3">
                {Icon && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <Icon className="size-4" aria-hidden="true" />
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{title}</h3>
                    {description && <p className="text-sm text-muted">{description}</p>}
                </div>
                {aside && <div className="shrink-0">{aside}</div>}
            </header>
            {children}
        </Surface>
    );
}

interface ConfigurationSubsectionProps {
    title: string;
    aside?: ReactNode;
    children: ReactNode;
}

export function ConfigurationSubsection({ title, aside, children }: ConfigurationSubsectionProps) {
    return (
        <section className="mt-4 border-t border-separator pt-4">
            <div className="mb-2 flex items-center gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h4>
                {aside}
            </div>
            {children}
        </section>
    );
}

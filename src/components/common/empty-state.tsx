/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ComponentType, ReactNode, SVGProps } from "react";
import { Search } from "lucide-react";

type EmptyStateProps = {
    text: ReactNode;
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({ text, icon: Icon = Search, description, action, className = "" }: EmptyStateProps) {
    return (
        <div className={`mx-auto flex max-w-md flex-col items-center justify-center gap-5 text-center ${className}`}>
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-neutral-500/15 blur-xl" aria-hidden/>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    <Icon className="size-7" strokeWidth={1.75} aria-hidden="true"/>
                </div>
            </div>

            <div className="space-y-1.5">
                <p className="text-base font-semibold">{text}</p>
                {description && <p className="text-sm text-neutral-500">{description}</p>}
            </div>

            {action}
        </div>
    );
}

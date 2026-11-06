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
    className?: string;
};

export function EmptyState({ text, icon: Icon = Search, className }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 text-muted ${className ?? ""}`}>
            <Icon className="size-10"/>
            <p className="text-sm font-medium">{text}</p>
        </div>
    );
}

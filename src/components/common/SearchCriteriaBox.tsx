/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ReactNode } from "react";

interface SearchCriteriaProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export function SearchCriteriaBox({
                                   children,
                                   title = "Search criteria",
                                   className,
                               }: SearchCriteriaProps) {
    return (
        <section className={`mt-6 mb-4 rounded-xl border border-border bg-surface p-4 ${className ?? ""}`}>
            <h2 className="text-sm font-semibold text-foreground mb-3">{title}</h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                {children}
            </div>
        </section>
    );
}

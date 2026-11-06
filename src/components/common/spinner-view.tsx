/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Spinner } from "@heroui/react";
import React from "react";

type SpinnerViewProps = {
    className?: string;
    label?: string;
    showLabel?: boolean;
};

export function SpinnerView({ className = "", label = "Loading…", showLabel = true }: SpinnerViewProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={`mx-auto flex max-w-md flex-col items-center justify-center gap-5 text-center ${className}`}
        >
            <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-accent/25 blur-xl" aria-hidden/>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                    <Spinner color="current" size="lg"/>
                </div>
            </div>

            <p className={showLabel ? "text-sm font-medium text-neutral-500" : "sr-only"}>
                {label}
            </p>
        </div>
    );
}

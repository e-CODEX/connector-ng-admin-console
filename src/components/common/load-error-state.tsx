/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Button } from "@heroui/react";
import { CloudOff, RefreshCw } from "lucide-react";

const DEFAULT_DESCRIPTION = "The server did not respond. Check that the backend is running and try again.";

export interface EvidenceTypeChipProps {
    title: string;
    description?: string;
    onRetry: () => void;
    className?: string;
}

export function LoadErrorState({
                                   title,
                                   description = DEFAULT_DESCRIPTION,
                                   onRetry,
                                   className = "min-h-[50vh]",
                               }: EvidenceTypeChipProps) {
    return (
        <div
            role="alert"
            className={`mx-auto flex max-w-md flex-col items-center justify-center gap-6 text-center ${className}`}
        >
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" aria-hidden/>
                <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                    <CloudOff size={28} strokeWidth={1.75}/>
                </div>
            </div>

            <div className="space-y-1.5">
                <h2 className="text-lg font-semibold">{title}</h2>
                {description && <p className="text-sm text-neutral-500">{description}</p>}
            </div>

            <Button variant="secondary" onPress={onRetry}>
                <RefreshCw size={16}/>
                Try again
            </Button>
        </div>
    );
}

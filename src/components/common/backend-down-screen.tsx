/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoadErrorState } from "@/components/common/load-error-state";

interface BackendDownScreenProps {
    /** Re-check automatically every N milliseconds. Omit to retry only on click. */
    autoRetryMs?: number;
}

export function BackendDownScreen({ autoRetryMs }: BackendDownScreenProps) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const retry = () => {
        // Re-runs the server components. If the backend is back, the page renders normally.
        startTransition(() => router.refresh());
    };

    useEffect(() => {
        if (!autoRetryMs) {
            return;
        }

        const timer = setInterval(retry, autoRetryMs);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRetryMs]);

    return (
        <LoadErrorState
            title="The connector is unreachable"
            onRetry={retry}
        />
    );
}

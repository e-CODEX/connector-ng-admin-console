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

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { LoadErrorState } from "@/components/common/load-error-state";

export default function RootError({ reset }: { error: Error; reset: () => void }) {
    const router = useRouter();

    const retry = () => {
        // Re-run the server components, then clear the error boundary.
        startTransition(() => {
            router.refresh();
            reset();
        });
    };

    return (
        <LoadErrorState
            title="The connector is unreachable"
            onRetry={retry}
        />
    );
}

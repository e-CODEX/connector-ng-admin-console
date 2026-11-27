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

import type { ReactNode } from "react";
import type { ConfigurationState } from "@/hooks/use-configuration";
import { SpinnerView } from "@/components/common/spinner-view";
import { LoadErrorState } from "@/components/common/load-error-state";

interface ConfigurationSectionProps<T> {
    state: ConfigurationState<T>;
    errorTitle: string;
    children: (config: T) => ReactNode;
}

export function ConfigurationSection<T>({ state, errorTitle, children }: ConfigurationSectionProps<T>) {
    if (state.loadError) {
        return <LoadErrorState title={errorTitle} onRetry={state.retry} className="min-h-80" />;
    }

    if (state.loading || !state.data) {
        return <SpinnerView className="min-h-80" />;
    }

    return <div className="flex flex-col gap-4">{children(state.data)}</div>;
}

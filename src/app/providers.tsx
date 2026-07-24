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

import { ThemeProvider } from "next-themes";
import React, { createContext } from "react";
import { AppConfig } from "@/config/config";

interface ProvidersProps {
    children: React.ReactNode;
    config: AppConfig
}

export const AppConfigContext = createContext<AppConfig | null>(null);

export function Providers({ children, config }: ProvidersProps) {
    return (
        <AppConfigContext value={config}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </AppConfigContext>
    );
}

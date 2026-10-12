/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { Metadata } from "next";
import "../styles/globals.css";
import { siteConfig } from "@/config/site";
import { GeistMono, GeistSans } from "@/config/fonts";
import { AppMainNavbar } from "@/components/common/menu/app-main-navbar";
import { AppFooter } from "@/components/common/app/app-footer";
import React from "react";
import { Toast } from "@heroui/react";
import { Providers } from "@/app/providers";
import { getAppConfig } from "@/config/config.server";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const config = getAppConfig();
    const user = await getCurrentUser();

    return (
        <html
            lang="en"
            className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
        <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers config={config} user={user}>
            <div className="relative flex flex-col min-h-screen">
                <AppMainNavbar/>
                <main className="grow flex flex-col px-3 pt-22 pb-12">
                    {children}
                </main>
                <AppFooter/>
                <Toast.Provider/>
            </div>
        </Providers>
        </body>
        </html>
    );
}

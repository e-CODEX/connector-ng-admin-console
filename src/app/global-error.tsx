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

import "../styles/globals.css";
import { RefreshCw } from "lucide-react";
import { Button } from "@heroui/react";

export default function GlobalError() {
    return (
        <html lang="en">
        <body className="flex min-h-screen items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
            <h2 className="text-lg font-semibold">The connector is unreachable</h2>
            <p className="text-sm text-neutral-500">
                The server did not respond. Check that the backend is running and try again.
            </p>

            <Button variant="secondary" onPress={() => window.location.reload()}>
                <RefreshCw size={16}/>
                Try again
            </Button>
        </div>
        </body>
        </html>
    );
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export default function ForbiddenPage() {
    return (
        <main className="mx-auto mt-24 max-w-md px-4 text-center">
            <h1 className="text-lg font-medium">403 — Forbidden</h1>
            <p className="text-muted mt-2 text-sm">
                You don&#39;t have permission to view this page.
            </p>
        </main>
    );
}

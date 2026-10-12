/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { AppInfoView } from "@/components/common/app/app-info-view";

export function AppFooter() {
    return (
        <footer className="border-divider bg-surface fixed inset-x-0 bottom-0 z-40 flex h-12 w-full items-center justify-center gap-4 border-t px-4">
            <AppInfoView variant="footer"/>
        </footer>
    );
}

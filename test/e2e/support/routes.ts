/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { Route } from "@playwright/test";

/**
 * True when the intercepted request is an API call made from page code (fetch/XHR).
 *
 * Page navigations can match the same URL patterns (e.g. a route ending in `/attachments`),
 * so stubs should call `route.fallback()` for anything else.
 */
export const isApiCall = (route: Route): boolean =>
    ["fetch", "xhr"].includes(route.request().resourceType());

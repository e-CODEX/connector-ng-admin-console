/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { Page, Request } from "@playwright/test";
import { anAttachment } from "@test/fixtures/attachments";
import type { PaginatedResponse } from "@/types/response/paginated-response";
import { isApiCall } from "./routes";

export const LIST_URL = (url: URL) =>
    url.pathname.startsWith("/api/backend/api/v1/admin") &&
    url.pathname.endsWith("/attachments");
export const DOWNLOAD_URL = (url: URL) =>
    /\/attachments\/[^/]+\/download$/.test(url.pathname);

export const stubAttachments = async (
    page: Page,
    items: unknown[] = [anAttachment()],
) => {
    const listRequests: Request[] = [];

    await page.route(LIST_URL, (route) => {
        if (!isApiCall(route)) return route.fallback();
        listRequests.push(route.request());
        return route.fulfill({
            json: {
                content: items,
                totalElements: items.length,
                totalPages: 1,
                size: 20,
            } satisfies PaginatedResponse<unknown>,
        });
    });

    await page.route(DOWNLOAD_URL, (route) =>
        !isApiCall(route)
            ? route.fallback()
            : route.fulfill({
                  body: "file-content",
                  headers: {
                      "content-type": "application/pdf",
                      "content-disposition":
                          'attachment; filename="Form_A.pdf"',
                  },
              }),
    );

    return { listRequests };
};

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { BrowserContext, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { anAttachment } from "@test/fixtures/attachments";
import { LIST_URL } from "./support/attachments-api";
import { isApiCall } from "./support/routes";
import { rowWith } from "./support/locators";

const PAGE_URL = "/admin/attachments";
const EXPIRED_NOTICE = "Your session has expired. Please sign in again.";

/**
 * Stubs the attachments list while the session is valid. Once the returned `endStub` is called, list calls reach
 * the app's backend proxy for real. (Not "first call only": in dev mode React runs effects twice, so the page
 * makes the initial call twice and keeps the second.)
 */
async function stubListWhileSignedIn(page: Page): Promise<() => void> {
    let stubbing = true;
    await page.route(LIST_URL, (route) => {
        if (!isApiCall(route) || !stubbing) return route.fallback();
        return route.fulfill({ json: { content: [anAttachment()], totalElements: 1, totalPages: 1, size: 20 } });
    });
    return () => {
        stubbing = false;
    };
}

/** Replaces the session cookies by a refresh token the mock backend rejects. */
async function revokeSession(context: BrowserContext) {
    await context.clearCookies();
    await context.addCookies([{ name: "refreshToken", value: "revoked", url: "http://localhost:3100" }]);
}

async function expectSignedOutWithNotice(page: Page) {
    await expect(page).toHaveURL(/\/login\?expired=1$/);
    await expect(page.getByText(EXPIRED_NOTICE)).toBeVisible();
}

test.describe("expired session", () => {
    test("should_sign_out_when_an_action_calls_the_api_after_the_session_cookies_expired", async ({
        page,
        context,
    }) => {
        const endStub = await stubListWhileSignedIn(page);
        await page.goto(PAGE_URL);
        await expect(rowWith(page, /Form_A\.pdf/)).toBeVisible();

        endStub();
        await context.clearCookies();
        await page.getByRole("button", { name: "Refresh" }).first().click();

        await expectSignedOutWithNotice(page);
    });

    test("should_sign_out_when_the_refresh_token_is_rejected_during_an_action", async ({ page, context }) => {
        const endStub = await stubListWhileSignedIn(page);
        await page.goto(PAGE_URL);
        await expect(rowWith(page, /Form_A\.pdf/)).toBeVisible();

        endStub();
        await revokeSession(context);
        await page.getByRole("button", { name: "Refresh" }).first().click();

        await expectSignedOutWithNotice(page);
    });

    test("should_sign_out_when_the_backend_rejects_the_access_token", async ({ page }) => {
        await page.route(LIST_URL, (route) =>
            isApiCall(route)
                ? route.fulfill({ status: 401, json: { message: "Full authentication is required" } })
                : route.fallback(),
        );

        await page.goto(PAGE_URL);

        await expectSignedOutWithNotice(page);
        await expect(page.getByText("Could not load attachments")).toHaveCount(0);
    });

    test("should_go_to_login_with_notice_when_a_link_is_followed_with_a_rejected_refresh_token", async ({
        page,
        context,
    }) => {
        const endStub = await stubListWhileSignedIn(page);
        await page.goto(PAGE_URL);
        await expect(rowWith(page, /Form_A\.pdf/)).toBeVisible();

        endStub();
        await revokeSession(context);
        await page.getByRole("link", { name: /Queues/ }).click();

        await expectSignedOutWithNotice(page);
    });

    test("should_go_to_login_without_notice_when_there_is_no_session_at_all", async ({ page, context }) => {
        await context.clearCookies();

        await page.goto(PAGE_URL);

        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByText(EXPIRED_NOTICE)).toHaveCount(0);
    });
});

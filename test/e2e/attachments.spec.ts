/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { expect, test } from "@playwright/test";
import { LIST_URL, stubAttachments } from "./support/attachments-api";
import { anAttachment } from "@test/fixtures/attachments";
import { actionButton, rowWith } from "./support/locators";
import { isApiCall } from "./support/routes";

const PAGE_URL = "/admin/attachments";

test.describe("attachments page", () => {
    test.describe("listing", () => {
        test("should_display_attachments_returned_by_the_api", async ({
            page,
        }) => {
            await stubAttachments(page, [
                anAttachment(),
                anAttachment({
                    identifier: "att-2",
                    name: "b.xml",
                    contentType: "text/xml",
                }),
            ]);

            await page.goto(PAGE_URL);

            await expect(
                rowWith(page, /Form_A\.pdf/),
            ).toBeVisible();
            await expect(
                rowWith(page, /b\.xml/),
            ).toBeVisible();
        });

        test("should_show_empty_state_when_api_returns_no_attachment", async ({
            page,
        }) => {
            await stubAttachments(page, []);

            await page.goto(PAGE_URL);

            await expect(
                page.getByText("No attachment available"),
            ).toBeVisible();
        });
    });

    test.describe("filters", () => {
        test("should_send_filename_filter_to_the_api_after_debounce", async ({
            page,
        }) => {
            const { listRequests } = await stubAttachments(page);
            await page.goto(PAGE_URL);
            await expect(
                rowWith(page, /Form_A\.pdf/),
            ).toBeVisible();

            const filtered = page.waitForRequest(
                (req) =>
                    LIST_URL(new URL(req.url())) &&
                    new URL(req.url()).searchParams.get("name") === "inv",
            );
            await page.getByLabel(/filename/i).fill("inv");
            await filtered;

            expect(listRequests.length).toBeLessThanOrEqual(3);
        });

        test("should_reset_the_criteria_when_clear_is_clicked", async ({
            page,
        }) => {
            await stubAttachments(page);
            await page.goto(PAGE_URL);
            await expect(rowWith(page, /Form_A\.pdf/)).toBeVisible();

            const clear = page.getByRole("button", { name: "Clear search criteria" });
            await expect(clear).toBeDisabled();

            const filtered = page.waitForRequest(
                (req) =>
                    LIST_URL(new URL(req.url())) &&
                    new URL(req.url()).searchParams.get("name") === "inv",
            );
            await page.getByLabel(/filename/i).fill("inv");
            await filtered;
            await expect(clear).toBeEnabled();

            const unfiltered = page.waitForRequest(
                (req) =>
                    LIST_URL(new URL(req.url())) &&
                    !new URL(req.url()).searchParams.has("name"),
            );
            await clear.click();
            await unfiltered;

            await expect(page.getByLabel(/filename/i)).toHaveValue("");
            await expect(clear).toBeDisabled();
        });
    });

    test.describe("error handling", () => {
        test("should_recover_when_retry_is_clicked_after_a_failed_load", async ({
            page,
        }) => {
            let fail = true;
            await stubAttachments(page);
            // registered last, so it runs first; fallback() hands over to the stub above
            await page.route(LIST_URL, (route) =>
                !isApiCall(route) || !fail
                    ? route.fallback()
                    : route.fulfill({ status: 500, json: { message: "boom" } }),
            );

            await page.goto(PAGE_URL);
            await expect(
                page.getByText("Could not load attachments"),
            ).toBeVisible();

            fail = false;
            await page.getByRole("button", { name: "Try again" }).click();

            await expect(
                rowWith(page, /Form_A\.pdf/),
            ).toBeVisible();
        });
    });

    test.describe("download", () => {
        test("should_download_the_file_when_download_is_clicked", async ({
            page,
        }) => {
            await stubAttachments(page);
            await page.goto(PAGE_URL);
            await expect(
                rowWith(page, /Form_A\.pdf/),
            ).toBeVisible();

            const download = page.waitForEvent("download");
            await actionButton(page, "Download").click();

            expect((await download).suggestedFilename()).toBe("Form_A.pdf");
        });

        test("should_disable_download_when_attachment_is_deleted", async ({
            page,
        }) => {
            await stubAttachments(page, [
                anAttachment({ deletedAt: "2026-11-01T00:00:00Z" }),
            ]);
            await page.goto(PAGE_URL);

            const row = rowWith(page, /Form_A\.pdf/);
            await expect(row).toBeVisible();
            await expect(actionButton(row, "Download")).toBeDisabled();
        });
    });
});

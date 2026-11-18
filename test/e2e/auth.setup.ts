/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { expect, test as setup } from "@playwright/test";

export const AUTH_FILE = "test/e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /username/i }).fill(process.env.E2E_USER!);
    await page.getByRole("textbox", { name: /password/i }).fill(process.env.E2E_PASSWORD!);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).not.toHaveURL(/\/login/);
    await page.context().storageState({ path: AUTH_FILE });
});

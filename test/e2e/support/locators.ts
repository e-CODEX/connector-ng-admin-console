/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { Locator, Page } from "@playwright/test";

type Scope = Page | Locator;

/**
 * A table row containing the given text.
 *
 * Rows can't be matched by accessible name: it comes from the row header column,
 * which is usually a truncated identifier (`CopyableIdentifier`).
 */
export const rowWith = (scope: Scope, text: string | RegExp): Locator =>
    scope.getByRole("row").filter({ hasText: text });

/**
 * An icon button rendered by `ActionButton` (e.g. "Details", "Download").
 *
 * `getByRole("button", { name })` matches twice: the HeroUI tooltip trigger wraps the
 * button in a `role="button"` div with the same name. The aria-label is only on the real button.
 */
export const actionButton = (scope: Scope, label: string): Locator =>
    scope.getByLabel(label, { exact: true });

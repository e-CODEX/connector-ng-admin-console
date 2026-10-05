/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { base64ToBlob } from "@/utils/fileUtils";

export async function readFixtureAsBase64(name: string): Promise<string> {
    const filePath = path.join(process.cwd(), "src/fixtures", path.basename(name));
    const buffer = await readFile(filePath);
    return buffer.toString("base64");
}

export async function readFixtureAsBlob(name: string, mimeType = "application/octet-stream"): Promise<Blob> {
    const base64 = await readFixtureAsBase64(name);
    return base64ToBlob(base64, mimeType);
}

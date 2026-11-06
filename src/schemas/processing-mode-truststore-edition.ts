/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { z } from "zod";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const TRUSTSTORE_EXTENSIONS = [".jks", ".keystore", ".p12", ".pfx"];

const hasExtension = (extensions: string[]) => (file: File) =>
    extensions.some((ext) => file.name.toLowerCase().endsWith(ext));

const withinSizeLimit = (file: File) => file.size <= MAX_FILE_SIZE;

export const processingModeTruststoreEditionSchema = z.object({
    file: z
        .instanceof(File, { error: "A truststore binary file is required" })
        .refine(hasExtension(TRUSTSTORE_EXTENSIONS), "File must be a .jks, .p12, .pfx or .keystore")
        .refine(withinSizeLimit, "File exceeds the 20 MB limit"),

    password: z
        .string({ error: "Truststore password is required" })
        .min(1, "Truststore password is required"),
});

export type ProcessingModeTruststoreEditionValues = z.infer<typeof processingModeTruststoreEditionSchema>;

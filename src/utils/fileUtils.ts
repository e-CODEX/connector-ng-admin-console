/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

/**
 * Generates a PDF file as a Blob with an approximate target size.
 *
 * The generated PDF contains the specified text repeated as needed to reach
 * the requested size. This function is primarily intended for testing file
 * uploads, transfers, storage limits, and performance scenarios.
 *
 * @param sizeMB - Target PDF size in megabytes (MB).
 * @param customText - Text content to include in the PDF. Defaults to "e-CODEX test file"
 */
export const generatePdfBlob = async (sizeMB: number, customText = "e-CODEX test file") => {
    const totalBytes = Math.floor(sizeMB * 1024 * 1024);

    const fontDefinition = "5 0 obj\n<</Font<</F1<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>>>>>\nendobj\n";

    const pdfTextStream = `BT\n/F1 18 Tf\n50 720 Td\n(${customText}) Tj\nET\n`;

    const header =
        "%PDF-1.4\n" +
        "%âãÏÓ\n" +
        "1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n" +
        "2 0 obj\n<</Type/Pages/Count 1/Kids[3 0 R]>>\nendobj\n" +
        "3 0 obj\n<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources 5 0 R>>\nendobj\n" +
        fontDefinition +
        "4 0 obj\n<</Length " + (totalBytes - 600) + ">>\nstream\n" +
        pdfTextStream;

    const footer = "\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000018 00000 n\n0000000077 00000 n\n0000000124 00000 n\n0000000227 00000 n\n0000000318 00000 n\ntrailer\n<</Size 6/Root 1 0 R>>\nstartxref\n400\n%%EOF";

    const headerArray = new TextEncoder().encode(header);
    const footerArray = new TextEncoder().encode(footer);

    const fillerSize = Math.max(0, totalBytes - headerArray.length - footerArray.length);
    const filler = new Uint8Array(fillerSize);

    const CHUNK_SIZE = 65536;
    for (let offset = 0; offset < filler.length; offset += CHUNK_SIZE) {
        const currentChunkSize = Math.min(CHUNK_SIZE, filler.length - offset);
        window.crypto.getRandomValues(filler.subarray(offset, offset + currentChunkSize));
    }

    return new Blob([headerArray, filler, footerArray], { type: 'application/pdf' });
};

export const getDocumentAsBase64String = async (document?: Blob) => {
    return document ? await blobToBase64(document) : null
}

/**
 * Generates XML content as a Blob or uses the provided XML Blob
 * and returns it as a Base64-encoded string.
 *
 * If an XML `Blob` is provided, it is converted directly to Base64.
 *
 * @param xmlContent - Optional XML Blob to use instead of generating XML.
 * @returns A promise resolving to a Base64-encoded XML string.
 */
export const getXmlContentAsBase64String = async (
    xmlContent?: Blob
): Promise<string|null> => {
    return xmlContent ? blobToBase64(xmlContent) : null;
};

/**
 * Generates XML content blob form data and returns it as a `Blob`.
 *
 * If an XML `Blob` is provided, it is directly returned.
 *
 * @param xmlContent
 */
export const getXmlContentAsBlob = async (
    xmlContent?: Blob
): Promise<Blob> => {
    return xmlContent
        ? xmlContent
        : new Blob(['<?xml version="1.0" encoding="UTF-8"?><testMessage>Test</testMessage>'], { type: "application/xml" });
};


/**
 * Encodes a UTF-8 string into a Base64 string.
 *
 * This implementation is safe for Unicode characters (e.g. accents, emojis),
 * unlike `btoa`, which only supports Latin1/ASCII input.
 *
 */
export const stringToBase64Utf8 = (input: string): string => {
    return Buffer.from(input, "utf-8").toString("base64");
}


/**
 * Gets the detached signature from the provided blob or generates a dummy signature.
 *
 * @param detachedSignatureAsBlob
 */
export const getDetachedSignatureAsBlob = (detachedSignatureAsBlob?: Blob) => {
    return detachedSignatureAsBlob
        ? detachedSignatureAsBlob
        : base64ToBlob(stringToBase64Utf8("<Signature xmlns='urn:test'>dummy</Signature>"), "application/xml");
}

/**
 * Converts a Blob into a Base64-encoded string.
 *
 * @param blob The Blob to convert.
 * @returns A Promise containing the Base64-encoded representation of the Blob.
 *
 * @throws {Error} If the Blob cannot be read or the conversion fails.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                resolve(result.split(',')[1] ?? '');
            } else {
                reject(new Error('Failed to convert blob to Base64'));
            }
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
};

/**
 * Converts a Base64-encoded string into a Blob object.
 *
 * This function decodes the provided Base64 content and creates a Blob
 * with the specified MIME type
 *
 * @param base64
 * @param mimeType
 */
export const base64ToBlob = (base64: string, mimeType = "application/octet-stream"): Blob => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
}

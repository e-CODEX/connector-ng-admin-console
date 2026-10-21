/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { SendMessageFormData } from "@/types/send-message-form";
import { RestOutboundMessageRequest, SoapOutboundMessageRequest } from "@/types/request/message";
import { getXmlContentAsBlob } from "@/utils/file-utils";
import { readFixtureAsBlob } from "@/actions/fixture-actions";


export async function appendBusinessContentToFormData(httpFormData: FormData, messageFormData: SendMessageFormData) {
    const businessContent = messageFormData.businessContent;

    const xmlBusinessContent = {
        data: businessContent.xmlContent ? businessContent.xmlContent : await getXmlContentAsBlob(),
        fileName: businessContent.xmlContent ? businessContent.xmlContent.name : "businessContent.xml"
    }
    httpFormData.append("businessContent.xmlContent", xmlBusinessContent.data, xmlBusinessContent.fileName);

    const businessDocument = {
        data: businessContent.businessDocument?.document ? businessContent.businessDocument.document : await readFixtureAsBlob("businessDocument.pdf", "application/pdf"),
        fileName: businessContent.businessDocument?.document ? businessContent.businessDocument.document.name : "businessDocument.pdf",
    }
    httpFormData.append("businessContent.businessDocument.document", businessDocument.data, businessDocument.fileName);

    if (!businessContent.businessDocument?.aesType) {
        httpFormData.append("businessContent.businessDocument.aesType", "SIGNATURE_BASED");
    }

    const detachedSignature = businessContent.businessDocument?.detachedSignature ? businessContent.businessDocument.detachedSignature.signature : undefined;

    if (detachedSignature) {
        // add detached signature file as blob
        const signature = businessContent.businessDocument?.detachedSignature;
        httpFormData.append("businessContent.businessDocument.detachedSignature.signature", detachedSignature, detachedSignature.name);
        httpFormData.append("businessContent.businessDocument.detachedSignature.mimeType", signature!.mimeType);
    }
}

/**
 * Helps flattens nested objects inside a value object using dot notation for keys and supports
 * primitive values, arrays, `File`/`Blob` instances, and nested objects.
 *
 * Example:
 * ```ts
 * const data = {
 *   subject: "Hello",
 *   recipients: ["alice@example.com", "bob@example.com"],
 *   metadata: {
 *     priority: "high",
 *     sender: {
 *       id: 123
 *     }
 *   }
 * };
 *
 * appendFormData(formData, data);
 * ```
 *
 * Produces the following `FormData` entries:
 * ```
 * subject = "Hello"
 * recipients = "alice@example.com"
 * recipients = "bob@example.com"
 * metadata.priority = "high"
 * metadata.sender.id = "123"
 * ```
 * @param formData
 * @param value
 * @param key
 */
export function appendFormData(formData: FormData, value: RestOutboundMessageRequest | SoapOutboundMessageRequest, key = "") {
    if (value == null) {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item) => {
            formData.append(key, item);
        });
        return;
    }

    if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
        return;
    }

    if (typeof value === "object") {
        Object.entries(value).forEach(([childKey, childValue]) => {
            appendFormData(
                formData,
                childValue,
                key ? `${key}.${childKey}` : childKey
            );
        });
        return;
    }
    formData.append(key, value);
}

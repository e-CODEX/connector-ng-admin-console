/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { v4 as uuidv4 } from 'uuid';
import { SendMessageFormData, SendParameters } from "@/types/send-message-form";
import { RestOutboundMessageRequest } from "@/types/request/message";
import { generatePdfBlob, getDetachedSignatureAsBlob, getXmlContentAsBlob } from "@/utils/fileUtils";
import { AttachmentService } from "@/services/attachment";
import { readFixtureAsBlob } from "@/actions/fixtureActions";

/**
 * Creates the payload for sending a REST outbound message.
 *
 * This function assembles all required parts of the outbound request,
 * including form data, transport parameters, and optional binary content
 * such as documents, XML content, and detached signatures.
 * This REST message payload is generated as a SIGNATURE-BASED payload.
 * And there is a detached signature file included in the payload
 *
 * Depending on which optional parameters are provided, the payload may include:
 * - A business document (`document`)
 * - XML content (`xmlContent`)
 * - A detached digital signature (`detachedSignature`)
 *
 * @param attachmentService - The attachment service.
 * @param asTestMessage - Whether to mark the message as a test message.
 * @param formData - Main form data containing business and AS4-related properties.
 * @param parameters - parameters to generate a business document for the outbound message.
 * @param businessDocument - The business document.
 * @param xmlBusinessContent - The business content.
 * @param detachedSignature - Optional detached signature as a Blob.
 */
export const createRestOutboundMessagePayLoad = async (
    attachmentService: AttachmentService,
    asTestMessage: boolean,
    formData: SendMessageFormData,
    parameters: SendParameters,
    businessDocument?: Blob,
    xmlBusinessContent?: Blob,
    detachedSignature?: Blob
) => {
    const attachment = await generatePdfBlob(parameters.attachmentSizeMB);
    const attachmentIds = await attachmentService.uploadMessageAttachment(attachment)
    const metadata = createMessageMetadata(formData, attachmentIds, asTestMessage);

    const dataToSubmit = new FormData();
    appendFormData(dataToSubmit, metadata);
    await appendBusinessContentToFormData(dataToSubmit, metadata, xmlBusinessContent, businessDocument, detachedSignature);
    return dataToSubmit;
};


async function appendBusinessContentToFormData(formData: FormData, metadata: RestOutboundMessageRequest, xmlBusinessContent?: Blob, businessDocument?: Blob, detachedSignatureAsBlob?: Blob) {
    // add metadata content as XML file as
    const businessContentData = xmlBusinessContent ?? await getXmlContentAsBlob();
    formData.append("businessContent.contentFile", businessContentData, "business.xml");

    const businessDocumentData = businessDocument ?? await readFixtureAsBlob("businessDocument.pdf", "application/pdf");
    formData.append("businessContent.businessDocument.document", businessDocumentData, "business.pdf");

    if (detachedSignatureAsBlob) {
        // add detached signature file as blob
        const signature = metadata.businessContent.businessDocument.detachedSignature;
        const detachedSignature = getDetachedSignatureAsBlob(detachedSignatureAsBlob);
        formData.append("businessContent.businessDocument.detachedSignature.signature", detachedSignature, signature?.name);
    }
}

function createMessageMetadata(formData: SendMessageFormData, attachmentIds: string[], asTestMessage: boolean = false) {
    const metadata = {
        businessDomainIdentifier: formData.businessDomainIdentifier || 'default_business_domain',
        backendMessageIdentifier: uuidv4(),
        attachments: attachmentIds,
        as4Properties: {
            ebmsMessageIdentifier: formData.as4Properties?.ebmsMessageIdentifier || crypto.randomUUID(),
            conversationIdentifier: formData.as4Properties?.conversationIdentifier || uuidv4(),
            originalSender: formData.as4Properties.originalSender,
            finalRecipient: formData.as4Properties.finalRecipient,
            fromParty: {
                identifier: formData.as4Properties?.fromParty?.identifier,
                identifierType: formData.as4Properties?.fromParty?.identifierType,
                role: formData.as4Properties?.fromParty?.role
            },
            toParty: {
                identifier: formData.as4Properties?.toParty?.identifier,
                identifierType: formData.as4Properties?.toParty?.identifierType,
                role: formData.as4Properties?.toParty?.role
            }
        },
        businessContent: {
            businessDocument: {
                aesType: "SIGNATURE_BASED"
            }
        }
    } as RestOutboundMessageRequest;

    if (!asTestMessage) {
        metadata.as4Properties.service = {
            name: formData.as4Properties?.service?.name,
            type: formData.as4Properties.service?.type
        }

        metadata.as4Properties.action = {
            name: formData.as4Properties?.action?.name
        }
    }

    return metadata;
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
function appendFormData(formData: FormData, value: RestOutboundMessageRequest, key = "") {
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


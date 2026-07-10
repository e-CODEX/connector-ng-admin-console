/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import {v4 as uuidv4} from 'uuid';
import {SendMessageFormData, SendParameters} from "@/types/send-message-form";
import {getDocumentAsBase64String, getXmlContentAsBase64String} from "@/utils/fileUtils";
import {SoapOutboundMessageDetails, SoapOutboundMessageRequest} from "@/types/request/message";


/**
 * Creates the payload for sending a SOAP outbound message.
 *
 * This function assembles all required parts of the outbound request,
 * including form data, transport parameters, and optional binary content
 * such as documents, XML content.
 * This SOAP message payload is generated as a SIGNATURE-BASED payload.
 * And there is no detached signature file included in the payload.
 *
 * Depending on which optional parameters are provided, the payload may include:
 * - A business document (`document`)
 * - XML content (`xmlContent`)
 *
 * @param formData - Main form data containing business and AS4-related properties.
 * @param parameters - parameters to generate a business document for the outbound message.
 * @param document - Optional binary document to attach to the message.
 * @param xmlContent - Optional XML payload of metadata as a Blob.
 */
export const createSoapOutboundMessagePayload = async (
    formData: SendMessageFormData,
    parameters: SendParameters,
    document?: Blob,
    xmlContent?: Blob) => {

    document ? console.log("Document is present") : console.log("Document will be generated");

    const base64Payload = await getDocumentAsBase64String(parameters.attachmentSizeMB, document);

    const businessXmlContent = await getXmlContentAsBase64String(xmlContent);

    const submitMessageRequest: SoapOutboundMessageRequest = {
        messageDetails: createMessageDetails(formData),
        messageContent: {
            xmlContent: businessXmlContent,
            document: {
                document: base64Payload,
                documentName: 'test-attachment.pdf',
                aesType: 'SIGNATURE_BASED'
            }
        }
    };

    return submitMessageRequest;
};


function createMessageDetails(formData: SendMessageFormData) {
    return {
        backendMessageIdentifier: formData.backendMessageIdentifier || uuidv4(),
        as4Properties: {
            conversationIdentifier: formData.as4Properties?.conversationIdentifier || uuidv4(),
            originalSender: formData.as4Properties?.originalSender,
            finalRecipient: formData.as4Properties?.finalRecipient,
            service: {
                name: formData.as4Properties?.service?.name,
                type: formData.as4Properties.service?.type
            },
            action: {
                name: formData.as4Properties?.action?.name
            },
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
        }
    } as SoapOutboundMessageDetails;
}

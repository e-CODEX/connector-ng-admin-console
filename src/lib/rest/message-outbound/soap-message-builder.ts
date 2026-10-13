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
import { SendMessageFormData } from "@/types/send-message-form";
import { blobToBase64, getXmlContentAsBase64String } from "@/utils/file-utils";
import { SoapOutboundMessageDetails, SoapOutboundMessageRequest } from "@/types/request/message";
import { readFixtureAsBlob } from "@/actions/fixture-actions";


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
 * @param messageFormData - Main form data containing business and AS4-related properties.
 */
export const createSoapOutboundMessagePayload = async (messageFormData: SendMessageFormData) => {
    const businessContent = messageFormData.businessContent;
    const xmlBusinessContent = businessContent.xmlContent !== undefined
        ? await blobToBase64(businessContent.xmlContent)
        : await getXmlContentAsBase64String();

    const businessDocument = businessContent.businessDocument?.document !== undefined
        ? await blobToBase64(businessContent.businessDocument.document)
        : await blobToBase64(await readFixtureAsBlob(
            "businessDocument.pdf",
            "application/pdf"
        ));

    const submitMessageRequest: SoapOutboundMessageRequest = {
        messageDetails: createMessageDetails(messageFormData),
        messageContent: {
            xmlContent: xmlBusinessContent,
            document: {
                document: businessDocument,
                documentName: 'business.pdf',
                aesType: "SIGNATURE_BASED"
            }
        }
    };

    return submitMessageRequest;
};

const createMessageDetails = (formData: SendMessageFormData) => {
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

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
import { generatePdfBlob } from "@/utils/file-utils";
import { SoapOutboundMessageRequest } from "@/types/request/message";
import { appendBusinessContentToFormData, appendFormData } from "@/lib/rest/message-outbound/message-builder";


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
 * @param parameters - Parameters concerning request mode or request repetitions
 */
export const createSoapOutboundMessagePayload = async (messageFormData: SendMessageFormData, parameters: SendParameters) => {
    const dataToSubmit = new FormData();
    const metadata = createMessageDetails(messageFormData);
    appendFormData(dataToSubmit, metadata);
    await appendBusinessContentToFormData(dataToSubmit, messageFormData);

    const attachment = await generatePdfBlob(parameters.attachmentSizeMB);
    dataToSubmit.append("attachments", attachment, "message-attachment.pdf");
    return dataToSubmit;
};

const createMessageDetails = (messageFormData: SendMessageFormData) => {
    return {
        messageDetails: {
            backendMessageIdentifier: messageFormData.backendMessageIdentifier || uuidv4(),
            businessDomainIdentifier: messageFormData.businessDomainIdentifier || 'default_business_domain',
            as4Properties: {
                ebmsIdentifier: messageFormData.as4Properties?.ebmsIdentifier || undefined,
                conversationIdentifier: messageFormData.as4Properties?.conversationIdentifier || uuidv4(),
                originalSender: messageFormData.as4Properties?.originalSender,
                finalRecipient: messageFormData.as4Properties?.finalRecipient,
                service: {
                    name: messageFormData.as4Properties?.service?.name,
                    type: messageFormData.as4Properties.service?.type
                },
                action: {
                    name: messageFormData.as4Properties?.action?.name
                },
                fromParty: {
                    identifier: messageFormData.as4Properties?.fromParty?.identifier,
                    identifierType: messageFormData.as4Properties?.fromParty?.identifierType,
                    role: messageFormData.as4Properties?.fromParty?.role
                },
                toParty: {
                    identifier: messageFormData.as4Properties?.toParty?.identifier,
                    identifierType: messageFormData.as4Properties?.toParty?.identifierType,
                    role: messageFormData.as4Properties?.toParty?.role
                }
            }
        },
        businessContent: {
            businessDocument: {
                aesType: messageFormData.businessContent.businessDocument?.aesType,
            }
        }
        ,
    } as SoapOutboundMessageRequest;
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export interface SendMessageResponse {
  identifier: string;
}

export interface SoapSendMessageResponse {
  messageId: string;
}

export interface RestOutboundMessageRequest {
  backendMessageIdentifier: string;
  backendName: string;
  attachments: string[];
  as4Properties: {
    ebmsMessageIdentifier: string;
    conversationIdentifier: string;
    referenceToIdentifier?: string;
    originalSender: string;
    finalRecipient: string;
    service: {
      name: string;
      type: string;
    };
    action: {
      name: string;
    };
    fromParty: {
      identifier: string;
      identifierType: string;
      role: string;
    };
    toParty: {
      identifier: string;
      identifierType: string;
      role: string;
    };
  };
}

export interface SoapOutboundMessageRequest {
  formData: unknown;
  parameters: unknown;
}
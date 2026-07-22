/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { OutboundMessageForm } from "@/components/message/outbound/outbound-message-form";
import { OutboundMessageSendParametersSection } from "@/components/message/outbound/outbound-message-send-params-section";
import { OutboundMessageActionBar } from "@/components/message/outbound/outbound-message-action-bar";
import { OutboundMessageConsoleContent, OutboundMessageConsolePanel } from "@/components/message/outbound/outbound-message-console-panel";
import { SendMessageFormData, SendParameters, } from "@/types/send-message-form";
import { sendMessage } from "@/services/message";
import { toastError } from "@/utils";
import { Send } from "lucide-react";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";
import { BusinessDomainSelector } from "@/components/form/business-domain-selector";
import { useProcessingModeServices } from "@/hooks/use-processing-mode-services";
import { useProcessingModeActions } from "@/hooks/use-processing-mode-actions";
import { useProcessingModeParties } from "@/hooks/use-processing-mode-parties";
import { Form } from "@heroui/react";

const initialMessageFormData: SendMessageFormData = {
    businessDomainIdentifier: "",
    backendMessageIdentifier: "",
    backendName: "backend_alice",
    as4Properties: {
        ebmsMessageIdentifier: "",
        referenceToIdentifier: "",
        conversationIdentifier: "",
        originalSender: "alice",
        finalRecipient: "bob",
        fromParty: {
            name: "",
            identifier: "BL",
            identifierType: "urn:oasis:names:tc:ebcore:partyid-type:ecodex",
            role: "GW",
            roleType: "INITIATOR",
            isHome: true,
        },
        toParty: {
            name: "",
            identifier: "RE",
            identifierType: "urn:oasis:names:tc:ebcore:partyid-type:ecodex",
            role: "GW",
            roleType: "RESPONDER",
            isHome: false,
        },
        service: {
            name: "EPO",
            type: "urn:e-codex:services:",
        },
        action: {
            name: "Form_A",
        },
    },
};

const initialSendParameters: SendParameters = {
    mode: "SOAP",
    attachmentSizeMB: 1,
    repeatCount: 1,
};

export default function MessageOutboundPage() {
    const [messageFormData, setMessageFormData] = useState<SendMessageFormData>(initialMessageFormData);
    const [sendParameters, setSendParameters] = useState<SendParameters>(initialSendParameters);
    const [logs, setLogs] = useState<OutboundMessageConsoleContent[]>([{ message: "Ready.", level: "INFO" }]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSending, setIsSending] = useState(false);

    const [businessDomainIdentifierQuery, setBusinessDomainIdentifierQuery] = useState<string>("");
    const businessDomainIdentifiers = useBusinessDomainIdentifiers();
    const processingModeServices = useProcessingModeServices(businessDomainIdentifierQuery);
    const processingModeActions = useProcessingModeActions(businessDomainIdentifierQuery);
    const processingModeParties = useProcessingModeParties(businessDomainIdentifierQuery);

    const validate = (data: SendMessageFormData, domain: string) => {
        const next: Record<string, string> = {};
        if (!domain) next.businessDomainIdentifier = "Select a business domain";
        if (!data.backendName) next.backendName = "Backend is required";
        if (!data.as4Properties.originalSender) next["as4Properties.originalSender"] = "Required";
        if (!data.as4Properties.service?.name) next["as4Properties.service"] = "Select a service";
        if (!data.as4Properties.action?.name) next["as4Properties.action"] = "Select an action";
        return next;
    };

    const handleSubmission = async () => {
        const found = validate(messageFormData, businessDomainIdentifierQuery);
        setErrors(found);
        if (Object.keys(found).length > 0) {
            return
        }

        try {
            setIsSending(true);
            setLogs((prev) => [
                ...prev,
                { message: `[${new Date().toLocaleTimeString()}] Sending message...\n`, level: "INFO" },
            ]);

            await sendMessage({
                formData: messageFormData,
                parameters: sendParameters,
            });

            setLogs((prev) => [
                ...prev,
                { message: `[${new Date().toLocaleTimeString()}] Message sent\n`, level: "SUCCESS" }
            ]);
        } catch (error) {
            setLogs((prev) => [
                ...prev,
                { message: `[${new Date().toLocaleTimeString()}] Send failed\n`, level: "ERROR" }
            ]);
            toastError(error)
        } finally {
            setIsSending(false);
        }
    };

    const handleSaveAsXml = () => {
        setLogs((prev) => [
            ...prev,
            { message: `[${new Date().toLocaleTimeString()}] Save as XML clicked\n`, level: "INFO" }
        ]);
    };

    const onBusinessDomainIdentifierChange = (value: string) => {
        setBusinessDomainIdentifierQuery(value)
    }

    return (
        <div>
            <PageHeader
                icon={Send}
                title="Send Bussiness Message"
                subtitle="Send a business message to a party"
            >
                <BusinessDomainSelector
                    label="Select a business domain"
                    identifiers={businessDomainIdentifiers}
                    value={businessDomainIdentifierQuery}
                    onValueChange={onBusinessDomainIdentifierChange}
                    showLabel={true}
                    className="flex flex-row items-center gap-3 min-w-70"
                />

                <OutboundMessageActionBar
                    formId="outbound-message-form"
                    onSubmit={handleSubmission}
                    isSending={isSending}
                    onSaveAsXml={handleSaveAsXml}
                />
            </PageHeader>

            <div className="space-y-3">
                <Form
                    id="outbound-message-form"
                    validationBehavior="native"
                    validationErrors={errors}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await handleSubmission();
                    }}
                    className="space-y-3"
                >
                    <OutboundMessageForm
                        data={messageFormData}
                        onChange={setMessageFormData}
                        businessDomainIdentifier={businessDomainIdentifierQuery}
                        processingModesServices={processingModeServices.items}
                        processingModesActions={processingModeActions.items}
                        processingModesParties={processingModeParties.items}
                    />
                </Form>

                <OutboundMessageSendParametersSection
                    data={sendParameters}
                    onChange={setSendParameters}
                />

                <OutboundMessageConsolePanel contents={logs}/>
            </div>
        </div>
    );
}

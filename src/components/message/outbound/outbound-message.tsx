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
import { FormUpdater, OutboundMessageForm } from "@/components/message/outbound/outbound-message-form";
import { OutboundMessageSendParametersSection } from "@/components/message/outbound/outbound-message-send-params-section";
import { OutboundMessageActionBar } from "@/components/message/outbound/outbound-message-action-bar";
import { OutboundMessageConsolePanel } from "@/components/message/outbound/outbound-message-console-panel";
import { SendMessageFormData, SendParameters, } from "@/types/send-message-form";
import { Send } from "lucide-react";
import { useBusinessDomainIdentifiers } from "@/hooks/use-business-domain-identifiers";
import { BusinessDomainSelector } from "@/components/form/business-domain-selector";
import { useProcessingModeServices } from "@/hooks/use-processing-mode-services";
import { useProcessingModeActions } from "@/hooks/use-processing-mode-actions";
import { useProcessingModeParties } from "@/hooks/use-processing-mode-parties";
import { Form, Switch } from "@heroui/react";
import { useAppConfig } from "@/hooks/use-app-config";
import { AppMode, OutboundMessageRequestMode } from "@/types/global";
import { useOutboundMessageSender } from "@/hooks/use-outbound-message-sender";
import { emptyAs4Selections, emptyBusinessDocument } from "@/components/message/outbound/outbound-message-defaults";

const FORM_ID = "outbound-message-form";

const DEFAULT_SEND_PARAMETERS: SendParameters = {
    mode: "SOAP",
    attachmentSizeMB: 1,
    repeatCount: 1,
};

type ModeFeatures = {
    outboundPageTitle: string;
    sendAsTestMessage: boolean;
    restrictToTestEntries: boolean;
    forcedRequestMode?: OutboundMessageRequestMode;
};

const MODE_FEATURES = {
    ADMIN_CONSOLE: {
        outboundPageTitle: "Send Test Business Message",
        sendAsTestMessage: true,
        restrictToTestEntries: true,
        forcedRequestMode: "REST",
    },
    TESTING_CONSOLE: {
        outboundPageTitle: "Send Business Message",
        sendAsTestMessage: false,
        restrictToTestEntries: false,
        forcedRequestMode: "SOAP",
    },
} satisfies Record<AppMode, ModeFeatures>;

const buildInitialMessageFormData = (defaultOriginalSender: string, defaultFinalRecipient: string): SendMessageFormData => {
    return {
        businessDomainIdentifier: "",
        backendMessageIdentifier: "",
        backendName: "",
        as4Properties: {
            ebmsMessageIdentifier: "",
            referenceToIdentifier: "",
            conversationIdentifier: "",
            originalSender: defaultOriginalSender,
            finalRecipient: defaultFinalRecipient,
            ...emptyAs4Selections(),
        },
        businessContent: emptyBusinessDocument()
    };
}

export type SendMessageValidationErrors = Record<string, string>;

const validate = (formData: SendMessageFormData): SendMessageValidationErrors => {
    const errors: SendMessageValidationErrors = {};
    const { as4Properties } = formData;

    if (!formData.businessDomainIdentifier) {
        errors.businessDomainIdentifier = "Select a business domain"
    }

    if (!formData.backendName) errors.backendName = "Backend is required";
    if (!as4Properties.originalSender) errors["as4Properties.originalSender"] = "Required";
    if (!as4Properties.service?.name) errors["as4Properties.service"] = "Select a service";
    if (!as4Properties.action?.name) errors["as4Properties.action"] = "Select an action";
    if (!as4Properties.fromParty?.identifier) errors["as4Properties.fromParty"] = "Select a sending party";
    if (!as4Properties.toParty?.identifier) errors["as4Properties.toParty"] = "Select a receiving party";

    const businessContent = formData.businessContent;

    const hasDetachedSignature = !!businessContent?.businessDocument?.detachedSignature?.signature;
    const hasBusinessDocument = !!businessContent?.businessDocument?.document;

    if (hasDetachedSignature && !hasBusinessDocument) {
        errors["businessContent.businessDocument.document"] =
            "A business document is required when a detached signature is provided.";
    }

    return errors;
};

export default function OutboundMessageComponent() {
    const { defaultOriginalSender, defaultFinalRecipient, appMode } = useAppConfig();
    const [useDefaultBusinessContent, setUseDefaultBusinessContent] = useState(true);

    const appModeFeatures = MODE_FEATURES[appMode];

    const [messageFormData, setMessageFormData] = useState<SendMessageFormData>(buildInitialMessageFormData(
        defaultOriginalSender,
        defaultFinalRecipient
    ));
    const [sendParameters, setSendParameters] = useState<SendParameters>(() => ({
        ...DEFAULT_SEND_PARAMETERS,
        mode: appModeFeatures.forcedRequestMode ?? DEFAULT_SEND_PARAMETERS.mode,
    }));
    const [errors, setErrors] = useState<SendMessageValidationErrors>({});

    const { logs, isSending, submitMessage } = useOutboundMessageSender(appModeFeatures.sendAsTestMessage);

    const businessDomainIdentifier = messageFormData.businessDomainIdentifier;
    const businessDomainIdentifiers = useBusinessDomainIdentifiers();
    const processingModeServices = useProcessingModeServices(businessDomainIdentifier);
    const processingModeActions = useProcessingModeActions(businessDomainIdentifier);
    const processingModeParties = useProcessingModeParties(businessDomainIdentifier);

    const clearErrors = () => setErrors((prev) => (Object.keys(prev).length > 0 ? {} : prev));

    const handleBusinessDomainChange = (value: string) => {
        setMessageFormData((prev) => ({
            ...prev,
            businessDomainIdentifier: value,
            as4Properties: { ...prev.as4Properties, ...emptyAs4Selections() },
        }));
        clearErrors();
    };

    const handleUseDefaultBusinessContentChange = (isSelected: boolean) => {
        setUseDefaultBusinessContent(isSelected);

        if (isSelected) {
            // default content: make sure no custom files are submitted
            handleFormChange((prev) => ({
                ...prev,
                businessContent: {
                    ...prev.businessContent,
                    contentFile: undefined,
                    businessDocument: {
                        aesType: "SIGNATURE_BASED"
                    },
                },
            }));
        }
    };

    const handleFormChange = (updater: FormUpdater) => {
        setMessageFormData(updater);
        clearErrors();
    };

    const handleSubmission = async () => {
        const found = validate(messageFormData);
        setErrors(found);
        if (Object.keys(found).length > 0) {
            return
        }

        await submitMessage(messageFormData, sendParameters);
    };

    return (
        <div>
            <PageHeader
                icon={Send}
                title={appModeFeatures.outboundPageTitle}
                subtitle="Send a business message to a party"
            >
                <Switch isSelected={useDefaultBusinessContent} onChange={handleUseDefaultBusinessContentChange}>
                    <Switch.Content>
                        Use default business content
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                    </Switch.Content>
                </Switch>

                <BusinessDomainSelector
                    label="Select a business domain"
                    identifiers={businessDomainIdentifiers}
                    value={businessDomainIdentifier}
                    onValueChange={handleBusinessDomainChange}
                    showLabel={true}
                    className="flex flex-row items-center gap-3 min-w-70"
                />
                {errors.businessDomainIdentifier && (
                    <p role="alert" className="text-xs text-danger">
                        {errors.businessDomainIdentifier}
                    </p>
                )}

                <OutboundMessageActionBar
                    formId={FORM_ID}
                    onSubmit={handleSubmission}
                    isSending={isSending}
                />
            </PageHeader>

            <div className="space-y-3">
                <Form
                    id={FORM_ID}
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
                        onChange={handleFormChange}
                        processingModesServices={processingModeServices.items}
                        processingModesActions={processingModeActions.items}
                        processingModesParties={processingModeParties.items}
                        restrictToTestEntries={appModeFeatures.restrictToTestEntries}
                        useDefaultBusinessContent={useDefaultBusinessContent}
                        errors={errors}
                    />
                </Form>

                <OutboundMessageSendParametersSection
                    data={sendParameters}
                    onChange={setSendParameters}
                    isModeLocked={appModeFeatures.restrictToTestEntries}
                />

                <OutboundMessageConsolePanel contents={logs}/>
            </div>
        </div>
    );
}

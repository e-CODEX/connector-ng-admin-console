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

import type { SendMessageFormData } from "@/types/send-message-form";
import { FormTextField } from "@/components/form/form-text-field";
import type { ConnectorProcessingModeAction, ConnectorProcessingModeParty, ConnectorProcessingModeService } from "@/types/response/processing-mode";
import { ProcessingModeServiceSelector, serviceKeyOf } from "@/components/form/selector/pmode-service-selector";
import { ProcessingModePartySelector } from "@/components/form/selector/pmode-party-selector";
import { actionKeyOf, ProcessingModeActionSelector } from "@/components/form/selector/pmode-action-selector";
import { useLinkPartners } from "@/hooks/use-link-partners";
import { LinkPartnerSelector } from "@/components/form/selector/link-partner-selector";
import type { ConnectorLinkPartner } from "@/types/response/link-partner";
import type { As4PropertiesRequest, BusinessDocumentInfo, PartyInfoRequest, OutboundMessageContent } from "@/types/request/message";
import { emptyAction, emptyParty, emptyService } from "@/components/message/outbound/outbound-message-defaults";
import { FileSelectField } from "@/components/form/file-select-field";
import React from "react";
import type { BusinessDocumentAesType, DetachedSignatureMimeType } from "@/types/global";
import { ACCEPTED_XMLS } from "@/types/global";
import type { SendMessageValidationErrors } from "@/components/message/outbound/outbound-message";

export type FormUpdater = (prev: SendMessageFormData) => SendMessageFormData;

const DEFAULT_AES_TYPE: BusinessDocumentAesType = "SIGNATURE_BASED";
const BINARY_SIGNATURE_TYPE: DetachedSignatureMimeType = "BINARY";
const XML_SIGNATURE_TYPE: DetachedSignatureMimeType = "XML";
const PKCS7_SIGNATURE_TYPE: DetachedSignatureMimeType = "PKCS7";

const DETACHED_SIGNATURE_TYPES_BY_EXTENSION = new Map<string, DetachedSignatureMimeType>([
    ["p7s", PKCS7_SIGNATURE_TYPE],
    ["p7m", PKCS7_SIGNATURE_TYPE],
    ["p7b", PKCS7_SIGNATURE_TYPE],
    ["xml", XML_SIGNATURE_TYPE],
    ["xsig", XML_SIGNATURE_TYPE],
    ["sig", BINARY_SIGNATURE_TYPE],
    ["sign", BINARY_SIGNATURE_TYPE],
    ["bin", BINARY_SIGNATURE_TYPE],
]);

const resolveSignatureType = (filename: string): DetachedSignatureMimeType => {
    const dot = filename.lastIndexOf(".");

    if (dot < 0) {
        return BINARY_SIGNATURE_TYPE
    }

    const extension = filename.slice(dot + 1).toLowerCase();
    return DETACHED_SIGNATURE_TYPES_BY_EXTENSION.get(extension) ?? BINARY_SIGNATURE_TYPE;
};

const partyKeyOf = (party: Pick<PartyInfoRequest, "identifier" | "identifierType">) =>
    `${party.identifier}-${party.identifierType}`;

interface OutboundMessageFormProps {
    data: SendMessageFormData;
    onChange: (updater: FormUpdater) => void;
    processingModesServices: ConnectorProcessingModeService[];
    processingModesActions: ConnectorProcessingModeAction[];
    processingModesParties: ConnectorProcessingModeParty[];
    restrictToTestEntries?: boolean;
    useDefaultBusinessContent?: boolean;
    errors?: SendMessageValidationErrors;
}

export function OutboundMessageForm({
                                        data,
                                        onChange,
                                        processingModesServices,
                                        processingModesActions,
                                        processingModesParties,
                                        restrictToTestEntries = true,
                                        useDefaultBusinessContent = true,
                                        errors
                                    }: OutboundMessageFormProps) {

    const backendLinkPartners = useLinkPartners("BACKEND");

    const businessDocumentError = errors?.["businessContent.businessDocument.document"];

    const { as4Properties } = data;

    const backendValue = data.backendName || null;
    const serviceValue = as4Properties.service?.name ? serviceKeyOf(as4Properties.service) : null;
    const actionValue = as4Properties.action?.name ? actionKeyOf(as4Properties.action) : null;
    const fromPartyValue = as4Properties.fromParty?.identifier ? partyKeyOf(as4Properties.fromParty) : null;
    const toPartyValue = as4Properties.toParty?.identifier ? partyKeyOf(as4Properties.toParty) : null;

    const businessContentFile = data.businessContent?.xmlContent ?? null;
    const businessDocumentFile = data.businessContent?.businessDocument?.document ?? null;
    const detachedSignatureFile = data.businessContent?.businessDocument?.detachedSignature?.signature ?? null;

    const update = (patch: Partial<SendMessageFormData>) =>
        onChange((prev) => ({ ...prev, ...patch }));

    const updateAs4 = (patch: Partial<As4PropertiesRequest>) =>
        onChange((prev) => ({ ...prev, as4Properties: { ...prev.as4Properties, ...patch } }));

    const updateBusinessContent = (patch: Partial<OutboundMessageContent>) =>
        onChange((prev) => ({
            ...prev,
            businessContent: { ...prev.businessContent, ...patch },
        }));

    const updateBusinessDocument = (patch: Partial<BusinessDocumentInfo>) =>
        onChange((prev) => ({
            ...prev,
            businessContent: {
                ...prev.businessContent,
                businessDocument: {
                    aesType: DEFAULT_AES_TYPE,
                    ...prev.businessContent?.businessDocument,
                    ...patch,
                },
            },
        }));

    const onBusinessContentChanged = (file: File | null) =>
        updateBusinessContent({
            xmlContent: file ?? undefined
        })

    const onBusinessDocumentChanged = (file: File | null) =>
        updateBusinessDocument({ document: file ?? undefined });

    const onDetachedSignatureChanged = (file: File | null) =>
        updateBusinessDocument({
            detachedSignature: file
                ? { signature: file, mimeType: resolveSignatureType(file.name) }
                : undefined,
        });

    const onBackendLinkPartnerChange = (partner: ConnectorLinkPartner | null) =>
        update({ backendName: partner?.name ?? "" });

    const onProcessingModeServiceChange = (service: ConnectorProcessingModeService | null) =>
        updateAs4({ service: service ? { ...service } : emptyService() });

    const onProcessingModeActionChange = (action: ConnectorProcessingModeAction | null) =>
        updateAs4({ action: action ? { ...action } : emptyAction() });

    const onProcessingModeFromPartyChange = (party: ConnectorProcessingModeParty | null) =>
        updateAs4({ fromParty: party ? { ...party } : emptyParty() });

    const onProcessingModeToPartyChange = (party: ConnectorProcessingModeParty | null) =>
        updateAs4({ toParty: party ? { ...party } : emptyParty() });

    const onBusinessContentFileSelect = (businessContent: File | null) => {
        onBusinessContentChanged(businessContent);
    };

    const onBusinessDocumentFileSelect = (businessDocument: File | null) => {
        onBusinessDocumentChanged(businessDocument);
    };

    const onDetachedSignatureFileSelect = (signature: File | null) => {
        onDetachedSignatureChanged(signature);
    };

    return (
        <section className="rounded-lg border border-separator bg-content1 p-2">
            <h2 className="mb-2 text-lg font-semibold">Message configuration</h2>

            <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <FormTextField
                        label="Conversation Id"
                        value={as4Properties.conversationIdentifier}
                        onChange={(value) => updateAs4({ conversationIdentifier: value })}
                    />

                    <FormTextField
                        label="Backend Message Id"
                        value={data.backendMessageIdentifier}
                        onChange={(value) => update({ backendMessageIdentifier: value })}
                    />

                    <FormTextField
                        label="Ebms Message Id"
                        value={as4Properties.ebmsIdentifier}
                        onChange={(value) => updateAs4({ ebmsIdentifier: value })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <LinkPartnerSelector
                        partners={backendLinkPartners}
                        value={backendValue}
                        onValueChange={onBackendLinkPartnerChange}
                        isRequired={true}
                        onlyTestPartners={restrictToTestEntries}
                    />
                    <FormTextField
                        label="Original Sender"
                        value={as4Properties.originalSender}
                        required
                        onChange={(value) => updateAs4({ originalSender: value })}
                    />

                    <FormTextField
                        label="Final Recipient"
                        value={as4Properties.finalRecipient}
                        required
                        onChange={(value) => updateAs4({ finalRecipient: value })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <ProcessingModeServiceSelector
                        name="as4Properties.service"
                        services={processingModesServices}
                        value={serviceValue}
                        onValueChange={onProcessingModeServiceChange}
                        isRequired={true}
                        showType={true}
                        onlyTestServices={restrictToTestEntries}
                    />

                    <ProcessingModeActionSelector
                        name="as4Properties.action"
                        actions={processingModesActions}
                        value={actionValue}
                        onValueChange={onProcessingModeActionChange}
                        isRequired={true}
                        onlyTestActions={restrictToTestEntries}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <ProcessingModePartySelector
                        label="From Party"
                        name="as4Properties.fromParty"
                        parties={processingModesParties}
                        value={fromPartyValue}
                        onValueChange={onProcessingModeFromPartyChange}
                        isRequired={true}
                        showType={true}
                        role="INITIATOR"
                    />

                    <ProcessingModePartySelector
                        label="To Party"
                        name="as4Properties.toParty"
                        parties={processingModesParties}
                        value={toPartyValue}
                        onValueChange={onProcessingModeToPartyChange}
                        isRequired={true}
                        showType={true}
                        role="RESPONDER"
                    />
                </div>

                {!useDefaultBusinessContent && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                        <FileSelectField
                            label="Business content"
                            file={businessContentFile}
                            onFileChange={onBusinessContentFileSelect}
                            acceptedFileTypes={ACCEPTED_XMLS}
                            buttonLabel="Choose file ..."
                        />

                        <FileSelectField
                            label="Business document"
                            file={businessDocumentFile}
                            onFileChange={onBusinessDocumentFileSelect}
                            acceptedFileTypes={["*"]}
                            buttonLabel="Choose file ..."
                            error={businessDocumentError}
                        />
                        <FileSelectField
                            label="Detached signature"
                            file={detachedSignatureFile}
                            onFileChange={onDetachedSignatureFileSelect}
                            acceptedFileTypes={ACCEPTED_XMLS.concat([
                                ".sig",
                                ".sign",
                                ".xsig",
                                ".bin",
                                "application/octet-stream",
                                "application/pkcs7-signature",
                                ".p12",
                                ".p7m",
                                ".p7s",
                                ".p7b",
                            ])}
                            buttonLabel="Choose file ..."
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

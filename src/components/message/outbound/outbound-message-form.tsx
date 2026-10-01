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

import { SendMessageFormData } from "@/types/send-message-form";
import { FormTextField } from "@/components/form/form-text-field";
import { ConnectorProcessingModeAction, ConnectorProcessingModeParty, ConnectorProcessingModeService } from "@/types/response/processing-mode";
import { ProcessingModeServiceSelector, serviceKeyOf } from "@/components/form/pmode-service-selector";
import { ProcessingModePartySelector } from "@/components/form/pmode-party-selector";
import { actionKeyOf, ProcessingModeActionSelector } from "@/components/form/pmode-action-selector";
import { useLinkPartners } from "@/hooks/use-link-partners";
import { LinkPartnerSelector } from "@/components/form/link-partner-selector";
import { ConnectorLinkPartner } from "@/types/response/link-partner";
import { As4PropertiesRequest, PartyInfoRequest } from "@/types/request/message";
import { emptyAction, emptyParty, emptyService } from "@/components/message/outbound/outbound-message-defaults";

export type FormUpdater = (prev: SendMessageFormData) => SendMessageFormData;

interface OutboundMessageFormProps {
    data: SendMessageFormData;
    onChange: (updater: FormUpdater) => void;
    processingModesServices: ConnectorProcessingModeService[];
    processingModesActions: ConnectorProcessingModeAction[];
    processingModesParties: ConnectorProcessingModeParty[];
    restrictToTestEntries?: boolean;
}

const partyKeyOf = (party: Pick<PartyInfoRequest, "identifier" | "identifierType">) =>
    `${party.identifier}-${party.identifierType}`;

export function OutboundMessageForm({
                                        data,
                                        onChange,
                                        processingModesServices,
                                        processingModesActions,
                                        processingModesParties,
                                        restrictToTestEntries = true,
                                    }: OutboundMessageFormProps) {
    const backendLinkPartners = useLinkPartners("BACKEND");

    const { as4Properties } = data;

    const backendValue = data.backendName || null;
    const serviceValue = as4Properties.service?.name ? serviceKeyOf(as4Properties.service) : null;
    const actionValue = as4Properties.action?.name ? actionKeyOf(as4Properties.action) : null;
    const fromPartyValue = as4Properties.fromParty?.identifier ? partyKeyOf(as4Properties.fromParty) : null;
    const toPartyValue = as4Properties.toParty?.identifier ? partyKeyOf(as4Properties.toParty) : null;

    const update = (patch: Partial<SendMessageFormData>) =>
        onChange((prev) => ({ ...prev, ...patch }));

    const updateAs4 = (patch: Partial<As4PropertiesRequest>) =>
        onChange((prev) => ({ ...prev, as4Properties: { ...prev.as4Properties, ...patch } }))

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
                        value={as4Properties.ebmsMessageIdentifier!}
                        onChange={(value) => updateAs4({ ebmsMessageIdentifier: value })}
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
            </div>
        </section>
    );
}

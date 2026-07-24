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
import { ProcessingModeServiceSelector } from "@/components/form/pmode-service-selector";
import { useState } from "react";
import { ProcessingModePartySelector } from "@/components/form/pmode-party-selector";
import { ProcessingModeActionSelector } from "@/components/form/pmode-action-selector";
import { useLinkPartners } from "@/hooks/use-link-partners";
import { LinkPartnerSelector } from "@/components/form/link-partner-selector";
import { ConnectorLinkPartner } from "@/types/response/link-partner";

interface OutboundMessageFormProps {
    data: SendMessageFormData;
    onChange: (next: SendMessageFormData) => void;
    businessDomainIdentifier: string;
    processingModesServices: ConnectorProcessingModeService[];
    processingModesActions: ConnectorProcessingModeAction[];
    processingModesParties: ConnectorProcessingModeParty[];
}

export function OutboundMessageForm({
                                        data,
                                        onChange,
                                        processingModesServices,
                                        processingModesActions,
                                        processingModesParties,
                                        businessDomainIdentifier
                                    }: OutboundMessageFormProps) {
    const [processingModeServiceName, setProcessingModeServiceName] = useState<string | null>(null);
    const [processingModeActionName, setProcessingModeActionName] = useState<string | null>(null);
    const [processingModeFromPartyName, setProcessingModeFromPartyName] = useState<string | null>(null);
    const [processingModeToPartyName, setProcessingModeToPartyName] = useState<string | null>(null);
    const [backendLinkPartnerName, setBackendLinkPartnerName] = useState<string | null>(null);

    const backendLinkPartners = useLinkPartners("BACKEND");

    const { as4Properties } = data;

    const onProcessingModeServiceChange = (service: ConnectorProcessingModeService | null) => {
        if (!service) return;
        updateAs4({ service: { ...service } });
        setProcessingModeServiceName(service.name);
    };

    const onProcessingModeActionChange = (action: ConnectorProcessingModeAction | null) => {
        if (!action) return;
        updateAs4({ action: { ...action } });
        setProcessingModeActionName(action.name);
    };

    const onProcessingModeFromPartyChange = (party: ConnectorProcessingModeParty | null) => {
        if (!party) return;
        updateAs4({
            fromParty: { ...party }
        });
        setProcessingModeFromPartyName(`${party.identifier}-${party.roleType}`);
    };

    const onProcessingModeToPartyChange = (party: ConnectorProcessingModeParty | null) => {
        if (!party) return;
        updateAs4({ toParty: { ...party } });
        setProcessingModeToPartyName(`${party.identifier}-${party.roleType}`);
    };

    const onBackendLinkPartnerChange = (partner: ConnectorLinkPartner | null) => {
        if (!partner) return;
        update({ backendName: partner.name })
        setBackendLinkPartnerName(partner.name);
    }

    const update = (patch: Partial<SendMessageFormData>) => {
        onChange({ ...data, ...patch, businessDomainIdentifier });
    };

    const updateAs4 = (patch: Partial<SendMessageFormData["as4Properties"]>) => {
        update({
            as4Properties: {
                ...data.as4Properties,
                ...patch,
            },
        });
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
                        value={as4Properties.ebmsMessageIdentifier}
                        onChange={(value) => updateAs4({ ebmsMessageIdentifier: value })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <LinkPartnerSelector
                        partners={backendLinkPartners}
                        value={backendLinkPartnerName}
                        onValueChange={onBackendLinkPartnerChange}
                        isRequired={true}
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
                        services={processingModesServices}
                        value={processingModeServiceName}
                        onValueChange={onProcessingModeServiceChange}
                        isRequired={true}
                        showType={true}
                    />

                    <ProcessingModeActionSelector
                        actions={processingModesActions}
                        value={processingModeActionName}
                        onValueChange={onProcessingModeActionChange}
                        isRequired={true}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-2">
                    <ProcessingModePartySelector
                        label="From Party"
                        parties={processingModesParties}
                        value={processingModeFromPartyName}
                        onValueChange={onProcessingModeFromPartyChange}
                        isRequired={true}
                        showType={true}
                    />

                    <ProcessingModePartySelector
                        label="To Party"
                        parties={processingModesParties}
                        value={processingModeToPartyName}
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

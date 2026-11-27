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

import { Chip } from "@heroui/react";
import { Fingerprint, ShieldCheck } from "lucide-react";
import type { MessageVerificationMode } from "@/types/response/configuration";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationValue } from "@/components/configuration/configuration-value";
import { BooleanChip } from "@/components/common/boolean-chip";

function VerificationModeChip({ mode }: { mode: MessageVerificationMode | null | undefined }) {
    if (!mode) return null;
    return (
        <Chip size="sm" variant="soft" color={mode === "STRICT" ? "accent" : "warning"}>
            <Chip.Label>{mode}</Chip.Label>
        </Chip>
    );
}

export function ConfigurationMessageProcessingSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("message-processing", configurationService.getMessageProcessingConfiguration);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the message processing configuration">
            {(config) => (
                <>
                    <ConfigurationBlock icon={Fingerprint} title="Identifiers" description="How the connector builds the identifiers of the messages it handles.">
                        <ConfigurationDetailList>
                            <ConfigurationDetailRow label="Connector identifier suffix">
                                <ConfigurationValue value={config.identifierSuffix} mono />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="ebMS identifier generation">
                                <BooleanChip value={config.ebmsIdGeneratorEnabled} yesLabel="Enabled" noLabel="Disabled" />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="ebMS identifier suffix">
                                <ConfigurationValue value={config.ebmsIdSuffix} mono />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Transport step identifier suffix">
                                <ConfigurationValue value={config.transportIdSuffix} mono />
                            </ConfigurationDetailRow>
                        </ConfigurationDetailList>
                    </ConfigurationBlock>

                    <ConfigurationBlock icon={ShieldCheck} title="Verification and evidences" description="How strictly messages are checked, and how evidences are handled.">
                        <ConfigurationDetailList>
                            <ConfigurationDetailRow label="Outbound message verification">
                                <VerificationModeChip mode={config.outboundMessageVerificationMode} />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Inbound message verification">
                                <VerificationModeChip mode={config.inboundMessageVerificationMode} />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Send generated evidences to the backend">
                                <BooleanChip value={config.sendGeneratedEvidencesToBackend} />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Trigger delivery evidences automatically">
                                <BooleanChip value={config.autoTriggerDeliveryEvidences} />
                            </ConfigurationDetailRow>
                        </ConfigurationDetailList>
                    </ConfigurationBlock>
                </>
            )}
        </ConfigurationSection>
    );
}

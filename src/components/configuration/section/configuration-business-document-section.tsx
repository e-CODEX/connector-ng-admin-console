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

import { FileText, Signature } from "lucide-react";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationValue } from "@/components/configuration/configuration-value";
import { ConfigurationSignatureView } from "@/components/configuration/view/configuration-signature-view";

export function ConfigurationBusinessDocumentSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("business-documents", configurationService.getBusinessDocumentConfiguration);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the business document configuration">
            {(config) => (
                <>
                    <ConfigurationBlock icon={FileText} title="Business document" description="Defaults applied to the business documents the connector issues.">
                        <ConfigurationDetailList>
                            <ConfigurationDetailRow label="Country">
                                <ConfigurationValue value={config.country} />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Service provider">
                                <ConfigurationValue value={config.serviceProvider} />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Default advanced electronic system type">
                                <ConfigurationValue value={config.defaultAdvancedSystemType} mono />
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Authentication identity provider">
                                <ConfigurationValue value={config.authenticationValidation?.identityProvider} />
                            </ConfigurationDetailRow>
                        </ConfigurationDetailList>
                    </ConfigurationBlock>

                    <ConfigurationBlock icon={Signature} title="Signature" description="Used to sign the business documents.">
                        <ConfigurationSignatureView signature={config.signature} />
                    </ConfigurationBlock>
                </>
            )}
        </ConfigurationSection>
    );
}

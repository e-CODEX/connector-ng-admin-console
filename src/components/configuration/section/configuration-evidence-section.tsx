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

import { BadgeCheck, Landmark } from "lucide-react";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock, ConfigurationSubsection } from "@/components/configuration/configuration-block";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationValue } from "@/components/configuration/configuration-value";
import { ConfigurationSignatureView } from "@/components/configuration/view/configuration-signature-view";

export function ConfigurationEvidenceSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("evidence", configurationService.getEvidenceConfiguration);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the evidence configuration">
            {(config) => {
                const as4Party = config.issuer?.as4Party;
                const address = config.issuer?.postalAddress;
                return (
                    <>
                        <ConfigurationBlock icon={Landmark} title="Issuer" description="The party named as issuer in the evidences the connector generates.">
                            <ConfigurationDetailList>
                                <ConfigurationDetailRow label="AS4 party name">
                                    <ConfigurationValue value={as4Party?.name} mono />
                                </ConfigurationDetailRow>
                                <ConfigurationDetailRow label="AS4 endpoint address">
                                    <ConfigurationValue value={as4Party?.endpointAddress} mono copyable />
                                </ConfigurationDetailRow>
                            </ConfigurationDetailList>

                            <ConfigurationSubsection title="Postal address">
                                <ConfigurationDetailList>
                                    <ConfigurationDetailRow label="Street">
                                        <ConfigurationValue value={address?.street} />
                                    </ConfigurationDetailRow>
                                    <ConfigurationDetailRow label="Locality">
                                        <ConfigurationValue value={address?.locality} />
                                    </ConfigurationDetailRow>
                                    <ConfigurationDetailRow label="Zip code">
                                        <ConfigurationValue value={address?.zipCode} />
                                    </ConfigurationDetailRow>
                                    <ConfigurationDetailRow label="Country">
                                        <ConfigurationValue value={address?.country} />
                                    </ConfigurationDetailRow>
                                </ConfigurationDetailList>
                            </ConfigurationSubsection>
                        </ConfigurationBlock>

                        <ConfigurationBlock icon={BadgeCheck} title="Signature" description="Used to sign the evidences.">
                            <ConfigurationSignatureView signature={config.signature} />
                        </ConfigurationBlock>
                    </>
                );
            }}
        </ConfigurationSection>
    );
}

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

import { Package } from "lucide-react";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationSignatureView } from "@/components/configuration/view/configuration-signature-view";

export function ConfigurationContainerSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("container", configurationService.getContainerConfiguration);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the container configuration">
            {(config) => (
                <ConfigurationBlock icon={Package} title="Container signature" description="Used to sign the ASiC containers that carry the messages.">
                    <ConfigurationSignatureView signature={config.signature} />
                </ConfigurationBlock>
            )}
        </ConfigurationSection>
    );
}

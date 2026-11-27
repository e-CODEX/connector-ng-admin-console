/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { PrivateKey } from "@/types/response/configuration";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationSecretValue } from "@/components/configuration/configuration-secret-value";
import { ConfigurationValue } from "@/components/configuration/configuration-value";

interface ConfigurationPrivateKeyViewProps {
    privateKey: PrivateKey | null | undefined;
}

export function ConfigurationPrivateKeyView({ privateKey }: ConfigurationPrivateKeyViewProps) {
    if (!privateKey) {
        return <p className="text-sm text-muted">No private key configured.</p>;
    }

    return (
        <ConfigurationDetailList>
            <ConfigurationDetailRow label="Alias">
                <ConfigurationValue value={privateKey.alias} mono copyable />
            </ConfigurationDetailRow>
            <ConfigurationDetailRow label="Password">
                <ConfigurationSecretValue value={privateKey.password} />
            </ConfigurationDetailRow>
        </ConfigurationDetailList>
    );
}

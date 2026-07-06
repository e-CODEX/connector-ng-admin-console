/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConfigurationSecretValue } from "@/components/configuration/configuration-secret-value";
import { PrivateKey } from "@/types/configuration";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";

export function ConfigurationPrivateKeyView({ privateKey }: { privateKey: PrivateKey }) {
    return (
        <dl>
            <ConfigurationDetailRow label="Alias">{privateKey.alias}</ConfigurationDetailRow>
            <ConfigurationDetailRow label="Password">
                <ConfigurationSecretValue value={privateKey.password}/>
            </ConfigurationDetailRow>
        </dl>
    );
}

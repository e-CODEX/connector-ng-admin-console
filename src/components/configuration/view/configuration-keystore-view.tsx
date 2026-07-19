/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Chip } from "@heroui/react";
import { Keystore } from "@/types/response/configuration";
import { ConfigurationSecretValue } from "@/components/configuration/configuration-secret-value";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";

interface ConfigurationKeystoreViewProps {
    keystore: Keystore;
}

export function ConfigurationKeystoreView({ keystore }: ConfigurationKeystoreViewProps) {
    return (
        <div>
            {keystore ? (
                <dl>
                    <ConfigurationDetailRow label="Path">{keystore.path}</ConfigurationDetailRow>
                    <ConfigurationDetailRow label="Type">
                        <Chip size="sm">{keystore.type}</Chip>
                    </ConfigurationDetailRow>
                    <ConfigurationDetailRow label="Password">
                        <ConfigurationSecretValue value={keystore.password}/>
                    </ConfigurationDetailRow>
                </dl>
            ) : (
                <div className="flex flex-col gap-3">No keystore configuration available</div>
            )}
        </div>
    );
}

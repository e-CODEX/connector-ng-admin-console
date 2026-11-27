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
import type { Keystore } from "@/types/response/configuration";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationSecretValue } from "@/components/configuration/configuration-secret-value";
import { ConfigurationValue } from "@/components/configuration/configuration-value";

interface ConfigurationKeystoreViewProps {
    keystore: Keystore | null | undefined;
}

export function ConfigurationKeystoreView({ keystore }: ConfigurationKeystoreViewProps) {
    if (!keystore) {
        return <p className="text-sm text-muted">No keystore configured.</p>;
    }

    return (
        <ConfigurationDetailList>
            <ConfigurationDetailRow label="Path">
                <ConfigurationValue value={keystore.path} mono copyable />
            </ConfigurationDetailRow>
            <ConfigurationDetailRow label="Type">
                {keystore.type && (
                    <Chip size="sm" variant="soft">
                        <Chip.Label>{keystore.type}</Chip.Label>
                    </Chip>
                )}
            </ConfigurationDetailRow>
            <ConfigurationDetailRow label="Password">
                <ConfigurationSecretValue value={keystore.password} />
            </ConfigurationDetailRow>
        </ConfigurationDetailList>
    );
}

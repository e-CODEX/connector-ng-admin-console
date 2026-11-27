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
import type { Signature } from "@/types/response/configuration";
import { ConfigurationSubsection } from "@/components/configuration/configuration-block";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationKeystoreView } from "@/components/configuration/view/configuration-keystore-view";
import { ConfigurationPrivateKeyView } from "@/components/configuration/view/configuration-private-key-view";
import { ConfigurationValidationView } from "@/components/configuration/view/configuration-validation-view";

function AlgorithmChip({ value }: { value: string | null | undefined }) {
    if (!value) return null;
    return (
        <Chip size="sm" variant="soft">
            <Chip.Label>{value}</Chip.Label>
        </Chip>
    );
}

interface ConfigurationSignatureViewProps {
    signature: Signature | null | undefined;
}

export function ConfigurationSignatureView({ signature }: ConfigurationSignatureViewProps) {
    if (!signature) {
        return <p className="text-sm text-muted">No signature configured.</p>;
    }

    return (
        <div>
            <ConfigurationDetailList>
                <ConfigurationDetailRow label="Encryption algorithm">
                    <AlgorithmChip value={signature.encryptionAlgorithm} />
                </ConfigurationDetailRow>
                <ConfigurationDetailRow label="Digest algorithm">
                    <AlgorithmChip value={signature.digestAlgorithm} />
                </ConfigurationDetailRow>
            </ConfigurationDetailList>

            <ConfigurationSubsection title="Keystore">
                <ConfigurationKeystoreView keystore={signature.keystore} />
            </ConfigurationSubsection>

            <ConfigurationSubsection title="Private key">
                <ConfigurationPrivateKeyView privateKey={signature.privateKey} />
            </ConfigurationSubsection>

            <ConfigurationSubsection title="Certificate validation">
                <ConfigurationValidationView validation={signature.validation} />
            </ConfigurationSubsection>
        </div>
    );
}

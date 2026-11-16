/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { Signature } from "@/types/response/configuration";
import { Chip } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationKeystoreView } from "@/components/configuration/view/configuration-keystore-view";
import { ConfigurationPrivateKeyView } from "@/components/configuration/view/configuration-private-key-view";
import { ConfigurationValidationView } from "@/components/configuration/view/configuration-validation-view";

interface ConfigurationSignatureViewProps {
    signature: Signature;
}

export function ConfigurationSignatureView({ signature }: ConfigurationSignatureViewProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                <Chip size="sm">{signature.encryptionAlgorithm}</Chip>
                <Chip size="sm">{signature.digestAlgorithm}</Chip>
            </div>
            {signature.keystore && (
                <ConfigurationBlock title="Keystore">
                    <ConfigurationKeystoreView keystore={signature.keystore}/>
                </ConfigurationBlock>
            )}
            {signature.privateKey && (
                <ConfigurationBlock title="Private key">
                    <ConfigurationPrivateKeyView privateKey={signature.privateKey}/>
                </ConfigurationBlock>
            )}
            {signature.validation && (
                <ConfigurationBlock title="Validation">
                    <ConfigurationValidationView validation={signature.validation}/>
                </ConfigurationBlock>
            )}
        </div>
    );
}

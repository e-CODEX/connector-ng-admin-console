/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Validation } from "@/types/response/configuration";
import { ConfigurationKeystoreView } from "@/components/configuration/view/configuration-keystore-view";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationBoolChip } from "@/components/configuration/configuration-bool-chip";

interface ConfigurationValidationViewProps {
    validation: Validation;
}

export function ConfigurationValidationView({ validation }: ConfigurationValidationViewProps) {
    return (
        <div>
            {validation ? (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        <ConfigurationBoolChip value={validation.ocspEnabled} label="OCSP"/>
                        <ConfigurationBoolChip value={validation.crlEnabled} label="CRL"/>
                        <ConfigurationBoolChip value={validation.aiaEnabled} label="AIA"/>
                        <ConfigurationBoolChip value={validation.truststoreEnabled} label="Truststore"/>
                        <ConfigurationBoolChip value={validation.ignoreStoreEnabled} label="Ignore store"/>
                    </div>
                    <dl>
                        <ConfigurationDetailRow label="Trusted list">{validation.trustedListSource || "—"}</ConfigurationDetailRow>
                    </dl>
                    {/* Keystore view reused at depth */}
                    {validation.truststoreEnabled && (
                        <ConfigurationBlock title="Truststore">
                            <ConfigurationKeystoreView keystore={validation.truststore}/>
                        </ConfigurationBlock>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-3">No validation configuration available</div>
            )}
        </div>
    );
}

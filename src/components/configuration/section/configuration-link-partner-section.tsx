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

import React, { useEffect, useState } from "react";
import { LinkPartnerConfiguration } from "@/types/response/configuration";
import { getLinkPartnerConfiguration } from "@/services/configuration";
import { toastError } from "@/utils";
import { Table } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationKeystoreView } from "@/components/configuration/view/configuration-keystore-view";
import { ConfigurationPrivateKeyView } from "@/components/configuration/view/configuration-private-key-view";
import { BooleanChip } from "@/components/common/boolean-chip";
import { SpinnerView } from "@/components/common/spinner-view";

export function ConfigurationLinkPartnerSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<LinkPartnerConfiguration | null>(null);

    const loadConfig = async () => {
        setLoading(true)
        try {
            const data = await getLinkPartnerConfiguration()
            setConfig(data || [])
        } catch (error) {
            toastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            await loadConfig()
        })()
    }, [])

    if (!config) {
        return null;
    }

    return (
        <div>
            {
                loading ? (
                    <SpinnerView className="mt-60"/>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ConfigurationBlock title="Backend Link Partners" note="">
                            {config.backend.map((backend) => (
                                <ConfigurationBlock title={backend.linkConfig.name} note="" key={backend.linkConfig.name}>
                                    <ConfigurationDetailRow label="Publishing address">
                                        {backend.linkConfig.properties.publishAddress}
                                    </ConfigurationDetailRow>
                                    <ConfigurationDetailRow label="Web service policy">
                                        {backend.linkConfig.properties.wsPolicy}
                                    </ConfigurationDetailRow>
                                    <ConfigurationDetailRow label="Loggind enabled">
                                        <BooleanChip value={backend.linkConfig.properties.loggingEnabled}/>
                                    </ConfigurationDetailRow>
                                    <ConfigurationBlock title="Keystore">
                                        <ConfigurationKeystoreView keystore={backend.linkConfig.properties.endpoint.keystore}/>
                                    </ConfigurationBlock>
                                    <ConfigurationBlock title="Truststore">
                                        <ConfigurationKeystoreView keystore={backend.linkConfig.properties.endpoint.truststore}/>
                                    </ConfigurationBlock>
                                    <ConfigurationBlock title="Private key">
                                        <ConfigurationPrivateKeyView privateKey={backend.linkConfig.properties.endpoint.privateKey}/>
                                    </ConfigurationBlock>
                                    <ConfigurationBlock title="Partners" note="Attached link partners">
                                        {backend.linkPartners.map((partner, index) => (
                                            <Table aria-label="Link partners" key={`${partner.name}-${index}`}>
                                                <Table.ScrollContainer>
                                                    <Table.Content aria-label="Link partners">
                                                        <Table.Header>
                                                            <Table.Column isRowHeader>Name</Table.Column>
                                                            <Table.Column>Description</Table.Column>
                                                            <Table.Column>Modes (sender / receiver)</Table.Column>
                                                            <Table.Column>Enabled</Table.Column>
                                                            <Table.Column>Encrypt Alias</Table.Column>
                                                            <Table.Column>Certificate DN</Table.Column>
                                                            <Table.Column>Push Address</Table.Column>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            <Table.Row>
                                                                <Table.Cell>
                                                                    <span className="font-mono text-sm">{partner.name}</span>
                                                                </Table.Cell>
                                                                <Table.Cell>{partner.description}</Table.Cell>
                                                                <Table.Cell>
                                                                    {partner.senderMode} / {partner.receiverMode}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <BooleanChip value={partner.enabled}/>
                                                                </Table.Cell>
                                                                <Table.Cell>{partner.properties.encryptionAlias}</Table.Cell>
                                                                <Table.Cell>{partner.properties.certificateDn}</Table.Cell>
                                                                <Table.Cell>{partner.properties.pushAddress}</Table.Cell>
                                                            </Table.Row>
                                                        </Table.Body>
                                                    </Table.Content>
                                                </Table.ScrollContainer>
                                            </Table>
                                        ))}
                                    </ConfigurationBlock>
                                </ConfigurationBlock>
                            ))}
                        </ConfigurationBlock>
                    </div>
                )
            }
        </div>
    );
}

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

import { Accordion, Chip, Table } from "@heroui/react";
import { Network } from "lucide-react";
import type { BackendPartner } from "@/types/response/configuration";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock, ConfigurationSubsection } from "@/components/configuration/configuration-block";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationValue } from "@/components/configuration/configuration-value";
import { ConfigurationKeystoreView } from "@/components/configuration/view/configuration-keystore-view";
import { ConfigurationPrivateKeyView } from "@/components/configuration/view/configuration-private-key-view";
import { BooleanChip } from "@/components/common/boolean-chip";
import { EmptyState } from "@/components/common/empty-state";

const countChip = (count: number) => (
    <Chip size="sm" variant="soft">
        <Chip.Label>{count}</Chip.Label>
    </Chip>
);

function BackendLink({ backend }: { backend: BackendPartner }) {
    const { properties } = backend.linkConfig;
    const partners = backend.linkPartners ?? [];

    return (
        <>
            <ConfigurationDetailList>
                <ConfigurationDetailRow label="Publishing address">
                    <ConfigurationValue value={properties.publishAddress} mono copyable />
                </ConfigurationDetailRow>
                <ConfigurationDetailRow label="Web service policy">
                    <ConfigurationValue value={properties.wsPolicy} mono />
                </ConfigurationDetailRow>
                <ConfigurationDetailRow label="Logging enabled">
                    <BooleanChip value={properties.loggingEnabled} />
                </ConfigurationDetailRow>
                <ConfigurationDetailRow label="Encryption alias">
                    <ConfigurationValue value={properties.endpoint?.encryptAlias} mono copyable />
                </ConfigurationDetailRow>
            </ConfigurationDetailList>

            <ConfigurationSubsection title="Keystore">
                <ConfigurationKeystoreView keystore={properties.endpoint?.keystore} />
            </ConfigurationSubsection>

            <ConfigurationSubsection title="Truststore">
                <ConfigurationKeystoreView keystore={properties.endpoint?.truststore} />
            </ConfigurationSubsection>

            <ConfigurationSubsection title="Private key">
                <ConfigurationPrivateKeyView privateKey={properties.endpoint?.privateKey} />
            </ConfigurationSubsection>

            <ConfigurationSubsection title="Link partners" aside={countChip(partners.length)}>
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label={`Link partners of ${backend.linkConfig.name}`}>
                            <Table.Header>
                                <Table.Column isRowHeader>Name</Table.Column>
                                <Table.Column>Description</Table.Column>
                                <Table.Column>Sender / receiver mode</Table.Column>
                                <Table.Column>Enabled</Table.Column>
                                <Table.Column>Encryption alias</Table.Column>
                                <Table.Column>Certificate DN</Table.Column>
                                <Table.Column>Push address</Table.Column>
                            </Table.Header>
                            <Table.Body renderEmptyState={() => <EmptyState text="No link partner attached" className="py-8" />}>
                                {partners.map((partner, index) => (
                                    <Table.Row key={`${partner.name}-${index}`}>
                                        <Table.Cell>
                                            <ConfigurationValue value={partner.name} mono />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <ConfigurationValue value={partner.description} />
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap">
                                            {partner.senderMode || "—"} / {partner.receiverMode || "—"}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <BooleanChip value={partner.enabled} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <ConfigurationValue value={partner.properties?.encryptionAlias} mono />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <ConfigurationValue value={partner.properties?.certificateDn} mono copyable />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <ConfigurationValue value={partner.properties?.pushAddress} mono copyable />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </ConfigurationSubsection>
        </>
    );
}

export function ConfigurationLinkPartnerSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("link-partners", configurationService.getLinkPartnerConfiguration);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the link partners configuration">
            {(config) => {
                const backends = config.backend ?? [];
                return (
                    <ConfigurationBlock
                        icon={Network}
                        title="Backend links"
                        description="Web service links to the backends, with their credentials and the link partners attached to them."
                        aside={countChip(backends.length)}
                    >
                        {backends.length === 0 ? (
                            <EmptyState text="No backend link configured" className="py-10" />
                        ) : (
                            <Accordion allowsMultipleExpanded defaultExpandedKeys={[backends[0].linkConfig.name]}>
                                {backends.map((backend) => (
                                    <Accordion.Item key={backend.linkConfig.name} id={backend.linkConfig.name}>
                                        <Accordion.Heading>
                                            <Accordion.Trigger>
                                                <span className="flex flex-1 items-center gap-2">
                                                    <span className="font-mono text-sm font-semibold">{backend.linkConfig.name}</span>
                                                    <span className="text-xs text-muted">
                                                        {(backend.linkPartners ?? []).length} link partner{(backend.linkPartners ?? []).length === 1 ? "" : "s"}
                                                    </span>
                                                </span>
                                                <Accordion.Indicator />
                                            </Accordion.Trigger>
                                        </Accordion.Heading>
                                        <Accordion.Panel>
                                            <Accordion.Body>
                                                <BackendLink backend={backend} />
                                            </Accordion.Body>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )}
                    </ConfigurationBlock>
                );
            }}
        </ConfigurationSection>
    );
}

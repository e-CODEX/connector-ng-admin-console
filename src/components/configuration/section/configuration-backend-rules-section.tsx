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

import { Chip, Table } from "@heroui/react";
import { Road, Split } from "lucide-react";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailList, ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationValue } from "@/components/configuration/configuration-value";
import { BooleanChip } from "@/components/common/boolean-chip";
import { EmptyState } from "@/components/common/empty-state";

export function ConfigurationBackendRulesSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("routing", configurationService.getRoutingConfiguration);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the routing configuration">
            {(config) => {
                const rules = config.backendRules ?? [];
                return (
                    <>
                        <ConfigurationBlock icon={Road} title="Routing" description="Which backend receives the incoming messages.">
                            <ConfigurationDetailList>
                                <ConfigurationDetailRow label="Routing">
                                    <BooleanChip value={config.enabled} yesLabel="Enabled" noLabel="Disabled" />
                                </ConfigurationDetailRow>
                                <ConfigurationDetailRow label="Default backend name">
                                    <ConfigurationValue value={config.defaultBackendName} mono />
                                </ConfigurationDetailRow>
                            </ConfigurationDetailList>
                        </ConfigurationBlock>

                        <ConfigurationBlock
                            icon={Split}
                            title="Backend rules"
                            description="A message goes to the first backend link whose clause it matches, otherwise to the default backend."
                            aside={
                                <Chip size="sm" variant="soft">
                                    <Chip.Label>{rules.length}</Chip.Label>
                                </Chip>
                            }
                        >
                            <Table variant="secondary">
                                <Table.ScrollContainer>
                                    <Table.Content aria-label="Backend rules">
                                        <Table.Header>
                                            <Table.Column isRowHeader>Backend link</Table.Column>
                                            <Table.Column>Match clause</Table.Column>
                                        </Table.Header>
                                        <Table.Body renderEmptyState={() => <EmptyState text="No backend rule configured" className="py-10" />}>
                                            {rules.map((rule, index) => (
                                                <Table.Row key={`${rule.linkName}-${index}`}>
                                                    <Table.Cell>
                                                        <ConfigurationValue value={rule.linkName} mono />
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <code className="rounded bg-surface-secondary px-1.5 py-0.5 font-mono text-sm">{rule.matchClause}</code>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Content>
                                </Table.ScrollContainer>
                            </Table>
                        </ConfigurationBlock>
                    </>
                );
            }}
        </ConfigurationSection>
    );
}

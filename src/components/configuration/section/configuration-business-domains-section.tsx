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
import { Building2 } from "lucide-react";
import { useConfigurationService } from "@/hooks/use-http-service";
import { useConfiguration } from "@/hooks/use-configuration";
import { ConfigurationSection } from "@/components/configuration/configuration-section";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationValue } from "@/components/configuration/configuration-value";
import { BooleanChip } from "@/components/common/boolean-chip";
import { EmptyState } from "@/components/common/empty-state";

export function ConfigurationBusinessDomainsSection() {
    const configurationService = useConfigurationService();
    const state = useConfiguration("business-domains", configurationService.getBusinessDomainsConfig);

    return (
        <ConfigurationSection state={state} errorTitle="Could not load the business domains configuration">
            {(config) => {
                const domains = config.defaults ?? [];
                return (
                    <ConfigurationBlock
                        icon={Building2}
                        title="Default business domains"
                        description="Business domains created from the connector configuration at startup."
                        aside={
                            <Chip size="sm" variant="soft">
                                <Chip.Label>{domains.length}</Chip.Label>
                            </Chip>
                        }
                    >
                        <Table variant="secondary">
                            <Table.ScrollContainer>
                                <Table.Content aria-label="Default business domains">
                                    <Table.Header>
                                        <Table.Column isRowHeader>Identifier</Table.Column>
                                        <Table.Column>Description</Table.Column>
                                        <Table.Column>Enabled</Table.Column>
                                        <Table.Column>Processing mode file</Table.Column>
                                    </Table.Header>
                                    <Table.Body renderEmptyState={() => <EmptyState text="No default business domain configured" className="py-10" />}>
                                        {domains.map((domain) => (
                                            <Table.Row key={domain.identifier}>
                                                <Table.Cell>
                                                    <ConfigurationValue value={domain.identifier} mono />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <ConfigurationValue value={domain.description} />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <BooleanChip value={domain.enabled} />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <ConfigurationValue value={domain.pmodeFile} mono copyable />
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Content>
                            </Table.ScrollContainer>
                        </Table>
                    </ConfigurationBlock>
                );
            }}
        </ConfigurationSection>
    );
}

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
import type { RoutingConfiguration } from "@/types/response/configuration";
import { toastError } from "@/utils";
import { Table } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { BooleanChip } from "@/components/common/boolean-chip";
import { SpinnerView } from "@/components/common/spinner-view";
import { useConfigurationService } from "@/hooks/use-http-service";

export function ConfigurationBackendRulesSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<RoutingConfiguration | null>(null);

    const configurationService = useConfigurationService();

    useEffect(() => {
        const loadConfig = async () => {
            setLoading(true)
            try {
                const data = await configurationService.getRoutingConfiguration()
                setConfig(data || [])
            } catch (error) {
                toastError(error)
            } finally {
                setLoading(false)
            }
        }

        (async () => {
            await loadConfig()
        })()
    }, [configurationService])

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
                        <ConfigurationBlock title="Global Configuration" note="">
                            <ConfigurationDetailRow label="Enabled">
                                <BooleanChip value={config.enabled}/>
                            </ConfigurationDetailRow>
                            <ConfigurationDetailRow label="Deafult backend name">
                                {config.defaultBackendName}
                            </ConfigurationDetailRow>
                        </ConfigurationBlock>

                        <ConfigurationBlock title="Backend rules" note="">
                            <Table aria-label="Routing rules">
                                <Table.ScrollContainer>
                                    <Table.Content aria-label="Routing rules">
                                        <Table.Header>
                                            <Table.Column isRowHeader>Link</Table.Column>
                                            <Table.Column>Match clause</Table.Column>
                                        </Table.Header>
                                        <Table.Body>
                                            {config.backendRules.map((rule) => (
                                                <Table.Row key={rule.linkName}>
                                                    <Table.Cell>{rule.linkName}</Table.Cell>
                                                    <Table.Cell>
                                                        <code className="font-mono text-sm">{rule.matchClause}</code>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Content>
                                </Table.ScrollContainer>
                            </Table>
                        </ConfigurationBlock>
                    </div>
                )
            }
        </div>
    )
}

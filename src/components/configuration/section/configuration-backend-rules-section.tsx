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

import { useEffect, useState } from "react";
import { RoutingConfiguration } from "@/types/response/configuration";
import { getRoutingConfiguration } from "@/services/configuration";
import { getBooleanLabel, toastError } from "@/utils";
import { Spinner, Table } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationDetailRow } from "@/components/configuration/configuration-detail-row";
import { ConfigurationBoolChip } from "@/components/configuration/configuration-bool-chip";

export function ConfigurationBackendRulesSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<RoutingConfiguration | null>(null);

    const loadConfig = async () => {
        setLoading(true)
        try {
            const data = await getRoutingConfiguration()
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
        <>
            {
                loading ? (
                    <div className="flex justify-center items-center min-h-400]">
                        <Spinner size="lg"/>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ConfigurationBlock title="Global Configuration" note="">
                            <ConfigurationDetailRow label="Enabled">
                                <ConfigurationBoolChip value={config.enabled} label={getBooleanLabel(config.enabled)}/>
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
        </>
    )
}

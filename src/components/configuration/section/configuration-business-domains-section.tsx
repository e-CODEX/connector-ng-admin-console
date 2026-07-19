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
import { BusinessDomainConfiguration } from "@/types/response/configuration";
import { getBusinessDomainsConfig } from "@/services/configuration";
import { getBooleanLabel, toastError } from "@/utils";
import { Spinner, Table } from "@heroui/react";
import { ConfigurationBlock } from "@/components/configuration/configuration-block";
import { ConfigurationBoolChip } from "@/components/configuration/configuration-bool-chip";

export function ConfigurationBusinessDomainsSection() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<BusinessDomainConfiguration | null>(null);

    const loadConfig = async () => {
        setLoading(true)
        try {
            const data = await getBusinessDomainsConfig()
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
                    <div className="flex justify-center items-center min-h-400]">
                        <Spinner size="lg"/>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ConfigurationBlock title="Business domains" note="Configured default business domains">
                            <Table aria-label="Configured busniess domains">
                                <Table.ScrollContainer>
                                    <Table.Content>
                                        <Table.Header>
                                            <Table.Column isRowHeader>Identifier</Table.Column>
                                            <Table.Column>Description</Table.Column>
                                            <Table.Column>Enabled</Table.Column>
                                            <Table.Column>Processing Mode File</Table.Column>
                                        </Table.Header>
                                        <Table.Body>
                                            {config.defaults.map((domain) => (
                                                <Table.Row key={domain.identifier}>
                                                    <Table.Cell>
                                                        <span className="font-mono text-sm">{domain.identifier}</span>
                                                    </Table.Cell>
                                                    <Table.Cell>{domain.description}</Table.Cell>
                                                    <Table.Cell>
                                                        <ConfigurationBoolChip value={domain.enabled} label={getBooleanLabel(domain.enabled)}/>
                                                    </Table.Cell>
                                                    <Table.Cell>{domain.pmodeFile}</Table.Cell>
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
    );
}

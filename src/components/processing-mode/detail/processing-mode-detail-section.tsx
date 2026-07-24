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

import { Table } from "@heroui/react";
import React from "react";
import { ConnectorProcessingModeDetail } from "@/types/response/processing-mode";
import { DetailSection } from "@/components/common/detail-section";
import { BooleanChip } from "@/components/common/boolean-chip";
import { ConfigurationKeystoreView } from "@/components/configuration/view/configuration-keystore-view";
import { Keystore } from "@/types/response/configuration";

interface ProcessingModeDetailsSectionProps {
    processingMode: ConnectorProcessingModeDetail | null;
    loading: boolean;
}

export function ProcessingModeDetailsSection({ processingMode, loading }: ProcessingModeDetailsSectionProps) {
    if (loading || !processingMode) {
        return null;
    }

    const { parties, services, actions, truststore } = processingMode;
    const keystore: Keystore = {
        path: truststore.filename,
        password: truststore.password,
        type: truststore.type,
    }

    return (
        <>
            <DetailSection title="Parties" isEmpty={!parties?.length} emptyLabel="No parties available.">
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Processing mode parties">
                            <Table.Header>
                                <Table.Column isRowHeader>Identifier</Table.Column>
                                <Table.Column>Identifier type</Table.Column>
                                <Table.Column>Name</Table.Column>
                                <Table.Column>Role</Table.Column>
                                <Table.Column>Role type</Table.Column>
                                <Table.Column>Is home</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {parties?.map((party, i) => (
                                    <Table.Row key={`${party.identifier}-${i}`}>
                                        <Table.Cell>
                                            <span className="block max-w-60 truncate font-semibold">
                                                {party.identifier}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>{party.identifierType}</Table.Cell>
                                        <Table.Cell>{party.name}</Table.Cell>
                                        <Table.Cell>{party.role}</Table.Cell>
                                        <Table.Cell>{party.roleType}</Table.Cell>
                                        <Table.Cell>
                                            <BooleanChip value={party.isHome} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </DetailSection>

            <DetailSection title="Services" isEmpty={!services?.length} emptyLabel="No services available.">
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Processing mode services">
                            <Table.Header>
                                <Table.Column isRowHeader>Name</Table.Column>
                                <Table.Column>Type</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {services?.map((service, i) => (
                                    <Table.Row key={`${service.name}-${i}`}>
                                        <Table.Cell>
                                            <span className="block max-w-60 truncate font-semibold">
                                                {service.name}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>{service.type}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </DetailSection>

            <DetailSection title="Actions" isEmpty={!actions?.length} emptyLabel="No actions available.">
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Processing mode actions">
                            <Table.Header>
                                <Table.Column isRowHeader>Name</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {actions?.map((action, i) => (
                                    <Table.Row key={`${action.name}-${i}`}>
                                        <Table.Cell>
                                            <span className="block max-w-60 truncate font-semibold">
                                                {action.name}
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </DetailSection>

            <DetailSection title="Truststore" isEmpty={!truststore} emptyLabel="No truststore available.">
                <ConfigurationKeystoreView keystore={keystore} />
            </DetailSection>
        </>
    );
}

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
import { DetailRow } from "@/components/common/detail-row";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DateTime } from "@/components/common/date-time";

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
        <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <DetailRow
                    label="Identifier"
                    value={<CopyableIdentifier identifier={processingMode.uuid} iconPosition="right"/>}/>
                <DetailRow label="Business domain" value={processingMode.businessDomainIdentifier}/>
                <DetailRow label="Description" value={processingMode.description}/>
                <DetailRow label="Filename" value={processingMode.filename}/>
                <DetailRow label="Created at" value={<DateTime value={processingMode.createdAt} precision="second"/>}/>
                <DetailRow label="Updated at" value={<DateTime value={processingMode.updatedAt} precision="second"/>}/>
            </div>
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
                {truststore.certificateInfo && (
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Processing mode truststore">
                                <Table.Header>
                                    <Table.Column isRowHeader>Alias</Table.Column>
                                    <Table.Column isRowHeader>Subject</Table.Column>
                                    <Table.Column isRowHeader>Issuer</Table.Column>
                                    <Table.Column isRowHeader>Key Algorithm</Table.Column>
                                    <Table.Column isRowHeader>Sign Algorithm</Table.Column>
                                    <Table.Column isRowHeader>Entry Type</Table.Column>
                                    <Table.Column isRowHeader>Validity</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {truststore.certificateInfo.map((certInfo, i) => (
                                        <Table.Row key={`${certInfo.alias}-${i}`}>
                                            <Table.Cell>
                                            <span className="block max-w-60 truncate font-semibold">
                                                {certInfo.alias}
                                            </span>
                                            </Table.Cell>
                                            <Table.Cell>{certInfo.subject}</Table.Cell>
                                            <Table.Cell>{certInfo.issuer}</Table.Cell>
                                            <Table.Cell>{certInfo.keyAlgorithm}</Table.Cell>
                                            <Table.Cell>{certInfo.signatureAlgorithm}</Table.Cell>
                                            <Table.Cell>{certInfo.entryType}</Table.Cell>
                                            <Table.Cell>{certInfo.validity}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                )}
            </DetailSection>
        </div>
    );
}

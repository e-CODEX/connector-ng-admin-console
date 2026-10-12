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

import { PageHeader } from "@/components/common/header/page-header";
import React from "react";
import { ConnectorBusinessDomain } from "@/types/response/business-domain";
import { Table, useOverlayState } from "@heroui/react";
import { toastError, toastSuccess, truncate } from "@/utils";
import { ArrowsRotateRight, Plus } from "@gravity-ui/icons";
import { BusinessDomainCreationView } from "@/components/business-domain/business-domain-creation-view";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { BooleanChip } from "@/components/common/boolean-chip";
import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useList } from "@/hooks/use-list";
import { DateTime } from "@/components/common/date-time";
import { useBusinessDomainService } from "@/hooks/use-http-service";

export default function BusinessDomainsAdminPage() {
    const businessDomainService = useBusinessDomainService();

    const list = useList<ConnectorBusinessDomain>(businessDomainService.listBusinessDomains);

    const addModal = useOverlayState();

    return (
        <div>
            <PageHeader
                icon={Building2}
                title="Business Domains"
                subtitle="Used for multi-tenancy"
            >
                <PageHeaderButton
                    variant="primary"
                    tooltip="Create a new business domain"
                    icon={Plus}
                    onPress={addModal.open}
                />
                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={ArrowsRotateRight}
                    onPress={list.refresh}
                    isDisabled={list.refreshing}
                    isSpinning={list.refreshing || list.loading}
                />
            </PageHeader>

            {list.loading ? (
                <SpinnerView className="mt-80"/>
            ) : (
                <>
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Connector business domains">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Description</Table.Column>
                                    <Table.Column>Source</Table.Column>
                                    <Table.Column>Enabled</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Updated at</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {list.items.map((businessDomain) => (
                                        <Table.Row key={businessDomain.identifier}>
                                            <Table.Cell>
                                                <span className="font-semibold truncate inline-block">
                                                    {truncate(businessDomain.identifier)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>{businessDomain.description}</Table.Cell>
                                            <Table.Cell>{businessDomain.source}</Table.Cell>
                                            <Table.Cell>
                                                <BooleanChip value={businessDomain.enabled}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <DateTime value={businessDomain.createdAt} precision="second"/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <DateTime value={businessDomain.updatedAt} precision="second"/>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {list.items.length === 0 && !list.refreshing && (
                        <EmptyState text="No business domain available" className="mt-70"/>
                    )}
                </>
            )}

            <BusinessDomainCreationView
                state={addModal}
                onSubmit={async (payload) => {
                    try {
                        await businessDomainService.createBusinessDomain(payload);
                        await list.refresh();
                        toastSuccess("Business domain created successfully");
                        addModal.close();
                    } catch (error) {
                        toastError(error);
                    }
                }}
            />
        </div>
    );
}

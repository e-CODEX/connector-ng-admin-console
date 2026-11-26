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
import type { ConnectorBusinessDomain } from "@/types/response/business-domain";
import { Table, useOverlayState } from "@heroui/react";
import { toastError, toastSuccess, truncate } from "@/utils";
import { BusinessDomainCreationView } from "@/components/business-domain/creation/business-domain-creation-view";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { BooleanChip } from "@/components/common/boolean-chip";
import { Building2, BuildingComplexPlus, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { useList } from "@/hooks/use-list";
import { DateTime } from "@/components/common/date-time";
import { useBusinessDomainService } from "@/hooks/use-http-service";
import { PagedListView } from "@/components/paging/paged-list-view";

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
                    icon={BuildingComplexPlus}
                    onPress={addModal.open}
                />
                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={RefreshCw}
                    onPress={list.refresh}
                    isDisabled={list.refreshing}
                    isSpinning={list.refreshing || list.loading}
                />
            </PageHeader>

            <PagedListView list={list} errorMessage="Could not load business domains">
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
                            <Table.Body
                                renderEmptyState={() => <EmptyState text="No business domain available" className="py-16"/>}
                            >
                                {list.items.map((businessDomain) => (
                                    <Table.Row key={businessDomain.identifier}>
                                        <Table.Cell>
                                            <span className="inline-block truncate font-semibold">
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
            </PagedListView>

            <BusinessDomainCreationView
                state={addModal}
                onSubmit={async (payload) => {
                    try {
                        await businessDomainService.createBusinessDomain(payload);
                    } catch (error) {
                        toastError(error);
                        return;
                    }
                    addModal.close();
                    toastSuccess("Business domain created successfully");
                    await list.refresh();
                }}
            />
        </div>
    );
}

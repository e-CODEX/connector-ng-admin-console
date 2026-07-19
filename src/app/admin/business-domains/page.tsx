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

import { PageHeader } from "@/components/common/page-header";
import React, { useEffect, useState } from "react";
import { ConnectorBusinessDomainResponse } from "@/types/response/business-domain";
import { Spinner, Table, useOverlayState } from "@heroui/react";
import { createBusinessDomain, listBusinessDomains } from "@/services/business-domain";
import { formatDate, toastError, toastSuccess, truncate } from "@/utils";
import { ArrowsRotateRight, Plus } from "@gravity-ui/icons";
import { BusinessDomainCreationView } from "@/components/business-domain/business-domain-creation-view";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { BooleanChip } from "@/components/common/boolean-chip";
import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";

export default function BusinessDomainsAdminPage() {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [businessDomains, setBusinessDomain] = useState<ConnectorBusinessDomainResponse[]>([])

    const addModal = useOverlayState();

    const onAddClick = () => {
        addModal.open();
    }

    const onRefreshClick = async () => {
        setRefreshing(true)
        try {
            await loadBusinessDomains();
        } finally {
            setRefreshing(false);
        }
    }

    const loadBusinessDomains = async () => {
        setLoading(true)
        try {
            const data = await listBusinessDomains()
            setBusinessDomain(data || [])
        } catch (error) {
            toastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            await loadBusinessDomains()
        })()
    }, [])

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
                    onPress={onAddClick}
                />
                <PageHeaderButton
                    variant="secondary"
                    tooltip="Refresh"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                    isDisabled={refreshing}
                    isSpinning={refreshing || loading}
                />
            </PageHeader>

            {loading ? (
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
                                    {businessDomains.map((businessDomain) => (
                                        <Table.Row key={businessDomain.identifier}>
                                            <Table.Cell>
                                                <span
                                                    className="font-semibold truncate inline-block">
                                                    {truncate(businessDomain.identifier)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>{businessDomain.description}</Table.Cell>
                                            <Table.Cell>{businessDomain.source}</Table.Cell>
                                            <Table.Cell>
                                                <BooleanChip value={businessDomain.enabled}/>
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(businessDomain.createdAt)}</Table.Cell>
                                            <Table.Cell>{formatDate(businessDomain.updatedAt)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {!loading && !refreshing && businessDomains && businessDomains.length === 0 && (
                        <EmptyState text="No business domain available" className="mt-70"/>
                    )}

                    <BusinessDomainCreationView
                        state={addModal}
                        onSubmit={async (payload) => {
                            try {
                                await createBusinessDomain(payload);
                                await onRefreshClick();
                                toastSuccess("Business domain created successfully");
                                addModal.close();
                            } catch (error) {
                                toastError(error)
                            }
                        }}
                    />
                </>
            )}
        </div>
    )
}

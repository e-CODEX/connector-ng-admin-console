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

import { PageHeader } from "@/components/common/page-hearder";
import { useEffect, useState } from "react";
import { ConnectorBusinessDomain } from "@/types/business-domain";
import { Chip, Spinner, Table, useOverlayState } from "@heroui/react";
import { createBusinessDomain, listBusinessDomains } from "@/services/business-domain";
import { formatDate, toastError, toastSuccess, truncate } from "@/utils";
import { ArrowsRotateRight, Plus } from "@gravity-ui/icons";
import { BusinessDomainAddModal } from "@/components/business-domain/business-domain-add-modal";
import { PageHeaderButton } from "@/components/common/page-header-button";

export default function BusinessDomainsAdminPage() {
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [businessDomains, setBusinessDomain] = useState<ConnectorBusinessDomain[]>([])

    const addModal = useOverlayState();

    const onAddClick = () => {
        addModal.open();
    }

    const onRefreshClick = async () => {
        setRefreshing(true)
        await loadBusinessDomains()
        setRefreshing(false)
    }

    const getStatusLabel = (enabled: boolean): string => {
        if (enabled) {
            return "Enabled"
        } else {
            return "Disabled"
        }
    }

    const getStatusColor = (enabled: boolean): "success" | "danger" => {
        if (enabled) {
            return "success"
        } else {
            return "danger"
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
        <>
            <PageHeader
                icon="grommet-icons:domain"
                title="Business Domains"
                subtitle="Used for multi-tenancy"
            >
                <PageHeaderButton
                    variant="primary"
                    icon={Plus}
                    onPress={onAddClick}
                />
                <PageHeaderButton
                    variant="secondary"
                    icon={ArrowsRotateRight}
                    onPress={onRefreshClick}
                    isDisabled={refreshing}
                    isSpinning={refreshing}
                />
            </PageHeader>

            {loading ? (
                <div className="flex justify-center items-center min-h-400]">
                    <Spinner size="lg"/>
                </div>
            ) : (
                <>
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Connector business domains">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Description</Table.Column>
                                    <Table.Column>Source</Table.Column>
                                    <Table.Column>Status</Table.Column>
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
                                                <Chip
                                                    color={getStatusColor(businessDomain.enabled)}
                                                    size="sm"
                                                    variant="soft"
                                                >
                                                    <Chip.Label>{getStatusLabel(businessDomain.enabled)}</Chip.Label>
                                                </Chip>
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(businessDomain.createdAt)}</Table.Cell>
                                            <Table.Cell>{formatDate(businessDomain.updatedAt)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    <BusinessDomainAddModal
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
        </>
    )
}

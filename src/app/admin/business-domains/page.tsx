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
import { Chip, Spinner, Table, toast } from "@heroui/react";
import { listBusinessDomains } from "@/services/business-domain";
import { formatDate, truncate } from "@/utils";

export default function BusinessDomainsAdminPage() {
    const [loading, setLoading] = useState(true)
    const [businessDomains, setBusinessDomain] = useState<ConnectorBusinessDomain[]>([])

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

    useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true)
            try {
                const data = await listBusinessDomains()
                if (!active) return
                setBusinessDomain(data || [])
            } catch (error) {
                if (!active) return
                toast("Error fetching business domain")
                console.error("Error fetching business domain:", error)
            } finally {
                if (active) setLoading(false)
            }
        })()

        return () => {
            active = false
        }
    }, [])

    return (
        <>
            <PageHeader
                icon="grommet-icons:domain"
                title="Business Domains"
                subtitle="Used for multi-tenancy"
            />

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
                </>
            )}
        </>
    )
}

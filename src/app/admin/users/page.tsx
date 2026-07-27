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

import { useUserService } from "@/hooks/use-http-service";
import { useList } from "@/hooks/use-list";
import { ConnectorUser } from "@/types/response/user";
import { User } from "lucide-react";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { ArrowsRotateRight, Plus } from "@gravity-ui/icons";
import { PageHeader } from "@/components/common/page-header";
import React from "react";
import { SpinnerView } from "@/components/common/spinner-view";
import { Table, useOverlayState } from "@heroui/react";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { EmptyState } from "@/components/common/empty-state";
import { BooleanChip } from "@/components/common/boolean-chip";
import { UserCreationView } from "@/components/user/user-creation-view";
import { toastError, toastSuccess } from "@/utils";
import { DateTime } from "@/components/common/date-time";

export default function UserAdminPage() {
    const userService = useUserService();
    const list = useList<ConnectorUser>(userService.listAllUsers);

    const addModal = useOverlayState();

    return (
        <div>
            <PageHeader
                icon={User}
                title="Users"
                subtitle="Created users"
            >
                <PageHeaderButton
                    variant="primary"
                    tooltip="Create a new user"
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
                            <Table.Content aria-label="Connector processing modes">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Username</Table.Column>
                                    <Table.Column>Email</Table.Column>
                                    <Table.Column>Enabled</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Updated at</Table.Column>
                                    <Table.Column>Action.s</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {list.items.map((user) => (
                                        <Table.Row key={user.uuid}>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={user.uuid}/>
                                            </Table.Cell>
                                            <Table.Cell>{user.username}</Table.Cell>
                                            <Table.Cell>{user.email}</Table.Cell>
                                            <Table.Cell>
                                                <BooleanChip value={user.enabled}/>
                                            </Table.Cell>
                                            <Table.Cell><DateTime value={user.createdAt} /></Table.Cell>
                                            <Table.Cell><DateTime value={user.updatedAt} /></Table.Cell>
                                            <Table.Cell></Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>

                    {list.items.length === 0 && !list.refreshing && (
                        <EmptyState text="No user available" className="mt-70"/>
                    )}
                </>
            )}

            <UserCreationView
                state={addModal}
                onSubmit={async (payload) => {
                    try {
                        await userService.createUser(payload);
                        await list.refresh();
                        toastSuccess("User created successfully");
                        addModal.close();
                    } catch (error) {
                        toastError(error);
                    }
                }}
            />
        </div>
    )
}

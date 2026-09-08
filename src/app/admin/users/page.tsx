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
import { User, UserLock, UserMinus } from "lucide-react";
import { PageHeaderButton } from "@/components/common/page-header-button";
import { ArrowsRotateRight, Plus } from "@gravity-ui/icons";
import { PageHeader } from "@/components/common/page-header";
import React, { useState } from "react";
import { SpinnerView } from "@/components/common/spinner-view";
import { Table, useOverlayState } from "@heroui/react";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { EmptyState } from "@/components/common/empty-state";
import { BooleanChip } from "@/components/common/boolean-chip";
import { UserCreationView } from "@/components/user/user-creation-view";
import { toastError, toastSuccess } from "@/utils";
import { DateTime } from "@/components/common/date-time";
import { ActionButton } from "@/components/common/action-button/action-button";
import { ConfirmModal } from "@/components/common/confirmation-modal";

export default function UserAdminPage() {
    const [selectedUser, setSelectedUser] = useState<ConnectorUser | null>(null);
    const userService = useUserService();
    const list = useList<ConnectorUser>(userService.listAllUsers);

    const addModal = useOverlayState();
    const blockConfirmationModal = useOverlayState();
    const deleteConfirmationModal = useOverlayState();

    const onBlockClicked = async (user: ConnectorUser) => {
        setSelectedUser(user);
        blockConfirmationModal.open()
    }

    const onDeleteClicked = async (user: ConnectorUser) => {
        setSelectedUser(user);
        deleteConfirmationModal.open()
    }

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
                                            <Table.Cell><DateTime value={user.createdAt}/></Table.Cell>
                                            <Table.Cell><DateTime value={user.updatedAt}/></Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <ActionButton
                                                        onPress={() => onBlockClicked(user)}
                                                        icon={UserLock} label="Disable"
                                                        iconAccent="text-warning"/>

                                                    <ActionButton
                                                        onPress={() => onDeleteClicked(user)}
                                                        icon={UserMinus} label="Delete"
                                                        iconAccent="text-danger"/>
                                                </div>
                                            </Table.Cell>
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

            <ConfirmModal
                isDismissable={false}
                state={blockConfirmationModal}
                title="Block User"
                message="Warning: Once this user is blocked, it will no longer be able to log in. Continue?"
                confirmLabel="Block"
                confirmVariant="danger-soft"
                onConfirm={async () => {
                    await userService.blockUser(selectedUser!.uuid)
                }}
                onCancel={() => blockConfirmationModal.close()}
            />

            <ConfirmModal
                isDismissable={false}
                state={deleteConfirmationModal}
                title="Delete User"
                message="
                Are you sure you want to delete this user? This action is permanent,
                cannot be undone, and the user will no longer be able to log in.
                Continue?
                "
                confirmLabel="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                    await userService.deleteUser(selectedUser!.uuid)
                }}
                onCancel={() => deleteConfirmationModal.close()}
            />
        </div>
    )
}

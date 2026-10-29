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
import { Pen, User, UserLock, UserMinus } from "lucide-react";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { ArrowsRotateRight, Plus } from "@gravity-ui/icons";
import { PageHeader } from "@/components/common/header/page-header";
import React, { useState } from "react";
import { SpinnerView } from "@/components/common/spinner-view";
import { Table, useOverlayState } from "@heroui/react";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { EmptyState } from "@/components/common/empty-state";
import { BooleanChip } from "@/components/common/boolean-chip";
import { UserCreationView } from "@/components/user/creation/user-creation-view";
import { toastError, toastErrorMessage, toastSuccess } from "@/utils";
import { DateTime } from "@/components/common/date-time";
import { ActionButton } from "@/components/common/action-button/action-button";
import { ConfirmModal } from "@/components/common/confirmation-modal";
import { UserCreationRequest } from "@/types/request/user";
import { applyRoleChanges, diffRoles } from "@/app/admin/users/user-role-change";

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

    const onCreateClicked = () => {
        setSelectedUser(null);        // null = create mode
        addModal.open();
    };
    const onEditClicked =  (user: ConnectorUser) => {
        setSelectedUser(user);
        addModal.open();
    }
    const formatRole = (role: string) =>
        role.replace(/^ROLE_/, "").replace(/_/g, " ");


    const handleSubmit = async (payload: UserCreationRequest): Promise<boolean> => {
        try {
            let userId: string;
            let changes: { toAdd: string[]; toRemove: string[] };

            if (selectedUser) {
                userId = selectedUser.uuid;
                await userService.updateUser(userId, {
                    username: payload.username,
                    password: payload.password,
                    email: payload.email,
                    enabled: payload.enabled,
                    roles: payload.roles,
                });
                changes = diffRoles(selectedUser.roles, payload.roles);
            } else {
                const created = await userService.createUser(payload as UserCreationRequest);
                if (!created?.uuid) {
                    throw new Error("Created user has no identifier");
                }
                userId = created.uuid;
                changes = { toAdd: payload.roles, toRemove: [] };
            }

            const { failedToAdd, failedToRemove } = await applyRoleChanges(userService, userId, changes);
            await list.refresh();

            if (failedToAdd.length > 0 || failedToRemove.length > 0) {
                const parts: string[] = [];
                if (failedToAdd.length) parts.push(`could not assign: ${failedToAdd.join(", ")}`);
                if (failedToRemove.length) parts.push(`could not remove: ${failedToRemove.join(", ")}`);
                toastErrorMessage(`User saved, but ${parts.join("; ")}.`);
            } else {
                toastSuccess(selectedUser ? "User updated successfully" : "User created successfully");
            }
            addModal.close();
            return true;
        } catch (error) {
            toastError(error);
            return false;
        }
    };

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
                    onPress={onCreateClicked}
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
                            <Table.Content aria-label="Connector users">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Username</Table.Column>
                                    <Table.Column>Email</Table.Column>
                                    <Table.Column>Roles</Table.Column>
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
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map((role) => (
                                                        <span key={role}
                                                              className="rounded-full bg-amber-700 px-2 py-0.5 text-xs">
                                                            {formatRole(role)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Table.Cell>
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

                                                    <ActionButton
                                                        label="Edit user"
                                                        icon={Pen}
                                                        onPress={() => onEditClicked(user)}/>
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
                key={selectedUser?.uuid ?? "new"}
                state={addModal}
                user={selectedUser}
                onSubmit={handleSubmit}
            />

            <ConfirmModal
                isDismissable={false}
                state={blockConfirmationModal}
                title="Block User"
                message="Warning: Once this user is blocked, it will no longer be able to log in. Continue?"
                confirmLabel="Block"
                confirmVariant="danger-soft"
                onConfirm={async () => {
                    await userService.blockUser(selectedUser!.uuid, selectedUser!.username)
                    await list.refresh();
                    blockConfirmationModal.close();
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
                    await userService.deleteUser(selectedUser!.uuid);
                    await list.refresh();
                    deleteConfirmationModal.close();
                }}
                onCancel={() => deleteConfirmationModal.close()}
            />
        </div>
    )
}

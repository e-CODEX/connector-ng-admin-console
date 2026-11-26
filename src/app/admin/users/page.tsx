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
import { useOptionalUser } from "@/hooks/useUser";
import type { ConnectorUser } from "@/types/response/user";
import { KeyRound, RefreshCw, RotateCcwKey, User, UserLock, UserMinus, UserPen, UserPlus } from "lucide-react";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { PageHeader } from "@/components/common/header/page-header";
import React, { useState } from "react";
import { SpinnerView } from "@/components/common/spinner-view";
import { Table, useOverlayState } from "@heroui/react";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { EmptyState } from "@/components/common/empty-state";
import { BooleanChip } from "@/components/common/boolean-chip";
import { UserCreationView } from "@/components/user/creation/user-creation-view";
import { toastError, toastSuccess } from "@/utils";
import { DateTime } from "@/components/common/date-time";
import { ActionButton } from "@/components/common/action-button/action-button";
import { ConfirmModal } from "@/components/common/confirmation-modal";
import type { UserCreationRequest, UserEditionRequest, UserRoleEditionRequest } from "@/types/request/user";
import { RoleChip } from "@/components/user/user-role-chip";
import { UserEditionView } from "@/components/user/edition/user-edition-view";
import { UserRoleEditionView } from "@/components/user/role-edition/user-role-edition-view";
import { PagedListView } from "@/components/paging/paged-list-view";

export default function UserAdminPage() {
    const [selectedUser, setSelectedUser] = useState<ConnectorUser | null>(null);
    const [busy, setBusy] = useState(false);

    const currentUser = useOptionalUser();
    const userService = useUserService();
    const list = useList<ConnectorUser>(userService.listAllUsers);

    const addModal = useOverlayState();
    const editModal = useOverlayState();
    const editRolesModal = useOverlayState();
    const blockConfirmationModal = useOverlayState();
    const deleteConfirmationModal = useOverlayState();
    const mustChangePasswordModal = useOverlayState();

    const isSelf = (user: ConnectorUser) => currentUser?.uuid === user.uuid;

    const perform = async (action: () => Promise<void>): Promise<void> => {
        setBusy(true);
        try {
            await action();
        } catch (error) {
            toastError(error);
        } finally {
            setBusy(false);
        }
    };

    const openFor = (modal: { open: () => void }, user: ConnectorUser) => {
        setSelectedUser(user);
        modal.open();
    };

    const handleCreationSubmission = (payload: UserCreationRequest) =>
        perform(async () => {
            const created = await userService.createUser(payload);
            addModal.close();
            toastSuccess(`User [${created.username}] created successfully`);
            await list.refresh();
        });

    const handleEditionSubmission = (payload: UserEditionRequest) =>
        perform(async () => {
            if (!selectedUser) return;
            const updated = await userService.editUser(selectedUser.uuid, {
                username: payload.username,
                email: payload.email,
                // An admin must not be able to disable their own account.
                enabled: isSelf(selectedUser) ? selectedUser.enabled : payload.enabled,
            });
            editModal.close();
            toastSuccess(`User [${updated.username}] updated successfully`);
            await list.refresh();
        });

    const handleRolesEditionSubmission = (payload: UserRoleEditionRequest) =>
        perform(async () => {
            if (!selectedUser) return;
            const updated = await userService.editUserRoles(selectedUser.uuid, { roles: payload.roles });
            editRolesModal.close();
            toastSuccess(`Roles of user [${updated.username}] updated successfully`);
            await list.refresh();
        });

    const handleBlockConfirmed = () =>
        perform(async () => {
            if (!selectedUser) return;
            await userService.blockUser(selectedUser.uuid, selectedUser.username);
            blockConfirmationModal.close();
            toastSuccess(`User [${selectedUser.username}] disabled`);
            await list.refresh();
        });

    const handleDeleteConfirmed = () =>
        perform(async () => {
            if (!selectedUser) return;
            await userService.deleteUser(selectedUser.uuid);
            deleteConfirmationModal.close();
            toastSuccess(`User [${selectedUser.username}] deleted`);
            await list.refresh();
        });

    const handleMustChangePassword = () =>
        perform(async () => {
            if (!selectedUser) return;
            await userService.askUserPasswordReset(selectedUser.uuid, selectedUser.username);
            mustChangePasswordModal.close();
            toastSuccess(`A password change will be required from [${selectedUser.username}] at the next sign-in`);
            await list.refresh();
        });

    return (
        <div>
            <PageHeader icon={User} title="Users" subtitle="Created users">
                <PageHeaderButton
                    variant="primary"
                    tooltip="Create a new user"
                    icon={UserPlus}
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

            <PagedListView list={list} errorMessage="Could not load users">
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Connector users">
                            <Table.Header>
                                <Table.Column isRowHeader>Identifier</Table.Column>
                                <Table.Column>Username</Table.Column>
                                <Table.Column>Email</Table.Column>
                                <Table.Column>Roles</Table.Column>
                                <Table.Column>Enabled</Table.Column>
                                <Table.Column>Must change password</Table.Column>
                                <Table.Column>Created at</Table.Column>
                                <Table.Column>Updated at</Table.Column>
                                <Table.Column>Actions</Table.Column>
                            </Table.Header>
                            <Table.Body
                                renderEmptyState={() => <EmptyState text="No user available" className="py-16"/>}
                            >
                                {list.items.map((user) => {
                                    const self = isSelf(user);
                                    return (
                                        <Table.Row key={user.uuid}>
                                            <Table.Cell>
                                                <CopyableIdentifier identifier={user.uuid}/>
                                            </Table.Cell>
                                            <Table.Cell>{user.username}</Table.Cell>
                                            <Table.Cell>{user.email}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map((role) => (
                                                        <RoleChip key={role} role={role}/>
                                                    ))}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <BooleanChip value={user.enabled}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <BooleanChip value={user.mustChangePassword}/>
                                            </Table.Cell>
                                            <Table.Cell><DateTime value={user.createdAt}/></Table.Cell>
                                            <Table.Cell><DateTime value={user.updatedAt}/></Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <ActionButton
                                                        label="Edit user"
                                                        icon={UserPen}
                                                        onPress={() => openFor(editModal, user)}/>

                                                    {!self && (
                                                        <ActionButton
                                                            label="Edit user role"
                                                            icon={KeyRound}
                                                            onPress={() => openFor(editRolesModal, user)}/>
                                                    )}

                                                    {!self && user.enabled && (
                                                        <ActionButton
                                                            label="Disable"
                                                            icon={UserLock}
                                                            iconAccent="text-warning"
                                                            onPress={() => openFor(blockConfirmationModal, user)}/>
                                                    )}

                                                    {!self && (
                                                        <ActionButton
                                                            label="Delete"
                                                            icon={UserMinus}
                                                            iconAccent="text-danger"
                                                            onPress={() => openFor(deleteConfirmationModal, user)}/>
                                                    )}

                                                    {!self && !user.mustChangePassword && (
                                                        <ActionButton
                                                            label="Require password change"
                                                            icon={RotateCcwKey}
                                                            iconAccent="text-muted"
                                                            onPress={() => openFor(mustChangePasswordModal, user)}/>
                                                    )}
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </PagedListView>

            <UserCreationView state={addModal} onSubmit={handleCreationSubmission}/>

            {selectedUser && (
                <>
                    <UserEditionView
                        key={`edit-${selectedUser.uuid}-${selectedUser.updatedAt}`}
                        state={editModal}
                        user={selectedUser}
                        isAdminContext={true}
                        onSubmit={handleEditionSubmission}
                    />
                    <UserRoleEditionView
                        key={`roles-${selectedUser.uuid}-${selectedUser.updatedAt}`}
                        state={editRolesModal}
                        user={selectedUser}
                        onSubmit={handleRolesEditionSubmission}
                    />
                </>
            )}

            <ConfirmModal
                isDismissable={false}
                state={blockConfirmationModal}
                title="Disable User"
                message="Once this user is disabled, they will no longer be able to sign in. Continue?"
                confirmLabel="Disable"
                confirmVariant="danger-soft"
                onConfirm={handleBlockConfirmed}
                onCancel={blockConfirmationModal.close}
            />

            <ConfirmModal
                isDismissable={false}
                state={deleteConfirmationModal}
                title="Delete User"
                message="Are you sure you want to delete this user? This action is permanent, cannot be undone, and the user will no longer be able to sign in. Continue?"
                confirmLabel="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirmed}
                onCancel={deleteConfirmationModal.close}
            />

            <ConfirmModal
                isDismissable={false}
                state={mustChangePasswordModal}
                title="Require Password Change"
                message={`${selectedUser?.username ?? "This user"} will be required to choose a new password the next time he sign in. His current password stays valid until then. Continue?`}
                confirmLabel="Require change"
                confirmVariant="primary"
                onConfirm={handleMustChangePassword}
                onCancel={mustChangePasswordModal.close}
            />

            {busy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
                    <SpinnerView/>
                </div>
            )}
        </div>
    );
}

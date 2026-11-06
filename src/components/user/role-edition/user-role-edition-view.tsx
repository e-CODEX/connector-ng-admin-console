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

import { Modal, useOverlayState } from "@heroui/react";
import { UserRoleEditionRequest } from "@/types/request/user";
import React from "react";
import { ConnectorUser } from "@/types/response/user";
import { UserRoleEditionForm } from "@/components/user/role-edition/user-role-edition-form";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { KeyRound } from "lucide-react";

interface UserRoleEditionViewProps {
    state: ReturnType<typeof useOverlayState>;
    user: ConnectorUser;
    onSubmit?: (payload: UserRoleEditionRequest) => Promise<void> | void;
}

export function UserRoleEditionView({ state, user, onSubmit }: UserRoleEditionViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-150">
                        <Modal.CloseTrigger/>

                        <Modal.Header>
                            <ModalHeaderIcon icon={KeyRound} tone="accent"/>
                            <Modal.Heading className="font-semibold">Edit User Roles</Modal.Heading>
                        </Modal.Header>

                        <UserRoleEditionForm
                            key={String(state.isOpen)}
                            user={user}
                            onSubmit={onSubmit}
                        />
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

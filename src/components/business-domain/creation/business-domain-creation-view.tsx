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

import type { useOverlayState } from "@heroui/react";
import { Modal } from "@heroui/react";
import React from "react";
import type { BusinessDomainCreationRequest } from "@/types/request/business-domain";
import { Plus } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { BusinessDomainCreationForm } from "@/components/business-domain/creation/business-domain-creation-form";

interface BusinessDomainCreationViewProps {
    state: ReturnType<typeof useOverlayState>;
    onSubmit?: (domain: BusinessDomainCreationRequest) => Promise<void> | void;
}

export function BusinessDomainCreationView({ state, onSubmit }: BusinessDomainCreationViewProps) {
    return (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false} isKeyboardDismissDisabled>
            <Modal.Container size="lg">
                <Modal.Dialog className="sm:max-w-150">
                    <Modal.CloseTrigger/>

                    <Modal.Header>
                        <ModalHeaderIcon icon={Plus} tone="accent"/>
                        <Modal.Heading className="font-semibold">Create A Business Domain</Modal.Heading>
                    </Modal.Header>

                    <BusinessDomainCreationForm state={state} onSubmit={onSubmit}/>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}

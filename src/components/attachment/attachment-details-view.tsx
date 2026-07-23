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
import { formatBytes, formatDate } from "@/utils";
import React from "react";
import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { DetailRow } from "@/components/common/detail-row";
import { AttachmentStorageChip } from "@/components/attachment/attachment-storage-chip";
import { Paperclip } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/modal-header-icon";

interface AttachmentDetailsViewProps {
    attachment: ConnectorAttachmentResponse | null;
    state: ReturnType<typeof useOverlayState>;
}

export function AttachmentDetailsView({ attachment, state }: AttachmentDetailsViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className="sm:max-w-200">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <ModalHeaderIcon icon={Paperclip} tone="accent"/>
                            <Modal.Heading className="font-semibold">Attachments Details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {attachment && (
                                <div className="flex flex-col">
                                    <DetailRow label="Identifier" value={attachment.identifier}/>
                                    <DetailRow label="Name" value={attachment.name}/>
                                    <DetailRow label="Content type" value={attachment.contentType}/>
                                    <DetailRow label="Description" value={attachment.description}/>
                                    <DetailRow label="Size" value={formatBytes(attachment.size)}/>
                                    <DetailRow label="Storage" value={
                                        <AttachmentStorageChip type={attachment.storage}/>
                                    }/>
                                    <DetailRow label="Type" value={attachment.type}/>
                                    <DetailRow label="Created at" value={formatDate(attachment.createdAt)}/>
                                    <DetailRow label="Updated at" value={formatDate(attachment.updatedAt)}/>
                                </div>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

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

import { Button, Modal, useOverlayState } from "@heroui/react";
import { formatBytes, saveFile, toastError } from "@/utils";
import React from "react";
import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { DetailRow } from "@/components/common/detail-row";
import { AttachmentStorageChip } from "@/components/attachment/attachment-storage-chip";
import { ArrowDownToLine, Paperclip } from "lucide-react";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { DateTime } from "@/components/common/date-time";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { useAttachmentService } from "@/hooks/use-http-service";

interface AttachmentDetailsViewProps {
    attachment: ConnectorAttachmentResponse | null;
    state: ReturnType<typeof useOverlayState>;
}

export function AttachmentDetailsView({ attachment, state }: AttachmentDetailsViewProps) {
    const attachmentService = useAttachmentService();

    const onDownloadClicked = async () => {
        try {
            const file = await attachmentService.downloadAttachment(attachment!.identifier, attachment!.name);
            saveFile(file);
        } catch (error) {
            toastError(error);
        }
    }

    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false}>
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
                                    <DetailRow label="Identifier" value={
                                        <CopyableIdentifier identifier={attachment.identifier} iconPosition="right" visibleChars={100}/>
                                    }/>
                                    <DetailRow label="Name" value={attachment.name}/>
                                    <DetailRow label="Content type" value={attachment.contentType}/>
                                    <DetailRow label="Description" value={attachment.description}/>
                                    <DetailRow label="Size" value={formatBytes(attachment.size)}/>
                                    <DetailRow label="Storage" value={
                                        <AttachmentStorageChip type={attachment.storage}/>
                                    }/>
                                    <DetailRow label="Type" value={attachment.type}/>
                                    <DetailRow label="Created at" value={
                                        <DateTime value={attachment.createdAt} precision="millis"/>
                                    }/>
                                    <DetailRow label="Updated at" value={
                                        <DateTime value={attachment.updatedAt} precision="millis"/>
                                    }/>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" className="w-full" onPress={() => onDownloadClicked()}>
                                <ArrowDownToLine />
                                Download
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

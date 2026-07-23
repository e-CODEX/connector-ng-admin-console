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

import { Button, Table, Tooltip, useOverlayState } from "@heroui/react";
import { ConnectorMessageDetailsResponse, ConnectorMessageEvidence } from "@/types/response/message";
import { formatBytes, formatDate, saveFile, toastError, truncate } from "@/utils";
import React, { useState } from "react";
import { DetailRow } from "@/components/common/detail-row";
import { DetailSection } from "@/components/common/detail-section";
import { ConnectorProcessingModeParty } from "@/types/response/processing-mode";
import { ArrowDownToLine } from "lucide-react";
import { downloadEvidence } from "@/services/evidence";
import { MessageDirectionChip } from "@/components/message/chip/message-direction-chip";
import { MessageDeliveryStatusChip } from "@/components/message/chip/message-delivery-status-chip";
import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { AttachmentDetailsView } from "@/components/attachment/attachment-details-view";
import { BusinessDetailsBusinessContentSection } from "@/components/message/detail/business-details-business-content-section";

interface MessageDetailsContentProps {
    message: ConnectorMessageDetailsResponse | null;
    loading: boolean;
}

export function MessageDetailsContent({ message, loading }: MessageDetailsContentProps) {
    const [selectedBusinessAttachment, setSelectedBusinessAttachment] = useState<ConnectorAttachmentResponse | null>(null);

    const businessAttachmentDetailsModal = useOverlayState();

    if (!message || loading) {
        return null;
    }

    const onDownloadEvidenceClicked = async (evidence: ConnectorMessageEvidence) => {
        try {
            const file = await downloadEvidence(evidence.uuid, evidence.type)
            saveFile(file);
        } catch (error) {
            toastError(error);
        }
    }

    const detailParty = (party: ConnectorProcessingModeParty) => {
        return `${party.identifier}(${party.identifierType})`
    }

    const onBusinessContentDetailsClick = async (attachment: ConnectorAttachmentResponse) => {
        setSelectedBusinessAttachment(attachment);
        businessAttachmentDetailsModal.open();
    }

    const { attachments, businessContent, errors, evidences } = message;

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <DetailRow label="Identifier" value={message.identifier}/>
                <DetailRow label="Business domain" value={message.businessDomainIdentifier}/>
                <DetailRow label="Conversation" value={message.as4Properties.conversationIdentifier}/>
                <DetailRow label="Backend ID" value={message.backendMessageIdentifier}/>
                <DetailRow label="From" value={detailParty(message.as4Properties.fromParty)}/>
                <DetailRow label="To" value={detailParty(message.as4Properties.toParty)}/>
                <DetailRow label="Backend" value={message.backendName}/>
                <DetailRow label="Gateway" value={message.gatewayName}/>
                <DetailRow label="Service" value={message.as4Properties.service.name}/>
                <DetailRow label="Action" value={message.as4Properties.action.name}/>
                <DetailRow label="Direction" value={
                    <MessageDirectionChip
                        direction={message.direction}
                    />
                }/>
                <DetailRow
                    label="Status"
                    value={
                        <MessageDeliveryStatusChip message={message}/>
                    }
                />
                <DetailRow label="Created at"
                           value={formatDate(message.createdAt)}/>
                <DetailRow label="Updated at"
                           value={formatDate(message.updatedAt)}/>
                <DetailRow label="Deleted at"
                           value={formatDate(message.deletedAt)}/>
                <DetailRow label="Rejected at"
                           value={formatDate(message.rejectedAt)}/>
                <DetailRow label="Confirmed at"
                           value={formatDate(message.confirmedAt)}/>
                <DetailRow label="Delivered to Link Partner at"
                           value={formatDate(message.deliveredToLinkPartnerAt)}/>
            </div>

            <div>
                <DetailSection
                    title="Business Content"
                    isEmpty={!businessContent}
                    emptyLabel="Not Yet Implemented."
                >
                    <BusinessDetailsBusinessContentSection
                        businessContent={businessContent}
                        onAttachmentDetailsClick={onBusinessContentDetailsClick}
                    />
                </DetailSection>

                <DetailSection
                    title="Attachments"
                    isEmpty={!attachments?.length}
                    emptyLabel="No attachments."
                >
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Message attachments">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Name</Table.Column>
                                    <Table.Column>Content Type</Table.Column>
                                    <Table.Column>Size</Table.Column>
                                    <Table.Column>Storage</Table.Column>
                                    <Table.Column>Type</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {attachments.map((attachment) => (
                                        <Table.Row key={attachment.identifier}>
                                            <Table.Cell>
                                                                            <span className="font-semibold truncate inline-block">
                                                                                {truncate(attachment.identifier, 10)}
                                                                            </span>
                                            </Table.Cell>
                                            <Table.Cell>{attachment.name}</Table.Cell>
                                            <Table.Cell>{attachment.contentType}</Table.Cell>
                                            <Table.Cell>{formatBytes(
                                                attachment.size)}</Table.Cell>
                                            <Table.Cell>{attachment.storage}</Table.Cell>
                                            <Table.Cell>{attachment.type}</Table.Cell>
                                            <Table.Cell>{formatDate(
                                                attachment.createdAt)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </DetailSection>

                <DetailSection
                    title="Evidences"
                    isEmpty={!evidences?.length}
                    emptyLabel="No evidences."
                >
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Message evidence">
                                <Table.Header>
                                    <Table.Column isRowHeader>Identifier</Table.Column>
                                    <Table.Column>Type</Table.Column>
                                    <Table.Column>Delivered to link partner at</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                    <Table.Column>Updated at</Table.Column>
                                    <Table.Column>Action</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {evidences.map((evidence) => (
                                        <Table.Row key={evidence.uuid}>
                                            <Table.Cell>
                                                                            <span className="font-semibold truncate inline-block">
                                                                                {truncate(evidence.uuid, 10)}
                                                                            </span>
                                            </Table.Cell>
                                            <Table.Cell>{evidence.type}</Table.Cell>
                                            <Table.Cell>{formatDate(evidence.deliveredToLinkPartnerAt)}</Table.Cell>
                                            <Table.Cell>{formatDate(evidence.createdAt)}</Table.Cell>
                                            <Table.Cell>{formatDate(evidence.updatedAt)}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1">
                                                    <Tooltip delay={0}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="secondary"
                                                            onPress={() => onDownloadEvidenceClicked(evidence)}
                                                        >
                                                            <ArrowDownToLine/>
                                                        </Button>
                                                        <Tooltip.Content showArrow>
                                                            <Tooltip.Arrow/>
                                                            <p>Download</p>
                                                        </Tooltip.Content>
                                                    </Tooltip>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </DetailSection>

                <DetailSection
                    title="Errors"
                    isEmpty={!errors?.length}
                    emptyLabel="No errors."
                >
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Message errors">
                                <Table.Header>
                                    <Table.Column isRowHeader>Label</Table.Column>
                                    <Table.Column>Source</Table.Column>
                                    <Table.Column>Description</Table.Column>
                                    <Table.Column>Created at</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {errors.map((error, i) => (
                                        <Table.Row key={`${error.label}-${i}`}>
                                            <Table.Cell>{error.label}</Table.Cell>
                                            <Table.Cell>{error.source}</Table.Cell>
                                            <Table.Cell>{error.details}</Table.Cell>
                                            <Table.Cell>{formatDate(error.createdAt)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </DetailSection>
            </div>

            <AttachmentDetailsView attachment={selectedBusinessAttachment} state={businessAttachmentDetailsModal}/>
        </div>
    );
}

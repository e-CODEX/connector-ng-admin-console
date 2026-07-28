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
import { formatBytes, saveFile, toastError } from "@/utils";
import React, { useState } from "react";
import { DetailRow } from "@/components/common/detail-row";
import { DetailSection } from "@/components/common/detail-section";
import { ConnectorProcessingModeParty } from "@/types/response/processing-mode";
import { ArrowDownToLine } from "lucide-react";
import { MessageDirectionChip } from "@/components/message/chip/message-direction-chip";
import { MessageDeliveryStatusChip } from "@/components/message/chip/message-delivery-status-chip";
import { ConnectorAttachmentResponse } from "@/types/response/attachments";
import { AttachmentDetailsView } from "@/components/attachment/attachment-details-view";
import { BusinessDetailsBusinessContentSection } from "@/components/message/detail/business-details-business-content-section";
import { DateTime } from "@/components/common/date-time";
import { useEvidenceService } from "@/hooks/use-http-service";
import { EvidenceTypeChip } from "@/components/common/evidence-chip";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";

interface MessageDetailsContentProps {
    message: ConnectorMessageDetailsResponse | null;
    loading: boolean;
}

const IDENTIFIER_LENGTH = 100;

export function MessageDetailsContent({ message, loading }: MessageDetailsContentProps) {
    const [selectedBusinessAttachment, setSelectedBusinessAttachment] = useState<ConnectorAttachmentResponse | null>(null);

    const evidenceService = useEvidenceService();

    const businessAttachmentDetailsModal = useOverlayState();

    if (!message || loading) {
        return null;
    }

    const onDownloadEvidenceClicked = async (evidence: ConnectorMessageEvidence) => {
        try {
            const file = await evidenceService.downloadEvidence(evidence.uuid, evidence.type)
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
                <DetailRow label="Identifier" value={
                    <CopyableIdentifier identifier={message.identifier} iconPosition="right" visibleChars={IDENTIFIER_LENGTH}/>
                }/>
                <DetailRow label="Business domain" value={message.businessDomainIdentifier}/>
                <DetailRow label="Conversation" value={
                    <CopyableIdentifier identifier={message.as4Properties.conversationIdentifier} iconPosition="right"
                                        visibleChars={IDENTIFIER_LENGTH}/>
                }/>
                <DetailRow label="Backend ID" value={
                    <CopyableIdentifier identifier={message.backendMessageIdentifier} iconPosition="right" visibleChars={IDENTIFIER_LENGTH}/>
                }/>
                <DetailRow label="From" value={detailParty(message.as4Properties.fromParty)}/>
                <DetailRow label="To" value={detailParty(message.as4Properties.toParty)}/>
                <DetailRow label="Original sender" value={message.as4Properties.originalSender}/>
                <DetailRow label="Final recipient" value={message.as4Properties.finalRecipient}/>
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
                    value={<MessageDeliveryStatusChip message={message}/>}
                />
                <DetailRow
                    label="Created at"
                    value={<DateTime value={message.createdAt} precision="millis"/>}
                />
                <DetailRow
                    label="Updated at"
                    value={<DateTime value={message.updatedAt} precision="millis"/>}
                />
                <DetailRow
                    label="Deleted at"
                    value={<DateTime value={message.deletedAt} precision="millis"/>}
                />
                <DetailRow
                    label="Rejected at"
                    value={<DateTime value={message.rejectedAt} precision="millis"/>}
                />
                <DetailRow
                    label="Confirmed at"
                    value={<DateTime value={message.confirmedAt} precision="millis"/>}
                />
                <DetailRow
                    label="Delivered to Link Partner at"
                    value={<DateTime value={message.deliveredToLinkPartnerAt} precision="millis"/>}
                />
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
                                                <CopyableIdentifier identifier={attachment.identifier} visibleChars={10}/>
                                            </Table.Cell>
                                            <Table.Cell>{attachment.name}</Table.Cell>
                                            <Table.Cell>{attachment.contentType}</Table.Cell>
                                            <Table.Cell>
                                                {formatBytes(attachment.size)}
                                            </Table.Cell>
                                            <Table.Cell>{attachment.storage}</Table.Cell>
                                            <Table.Cell>{attachment.type}</Table.Cell>
                                            <Table.Cell><DateTime value={attachment.createdAt} precision="millis"/></Table.Cell>
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
                                                <CopyableIdentifier identifier={evidence.uuid} visibleChars={10}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <EvidenceTypeChip type={evidence.type}/>
                                            </Table.Cell>
                                            <Table.Cell><DateTime value={evidence.deliveredToLinkPartnerAt} precision="millis"/></Table.Cell>
                                            <Table.Cell><DateTime value={evidence.createdAt} precision="millis"/></Table.Cell>
                                            <Table.Cell><DateTime value={evidence.updatedAt} precision="millis"/></Table.Cell>
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
                                            <Table.Cell><DateTime value={error.createdAt} precision="millis"/></Table.Cell>
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

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

import { Button, Chip, Modal, Spinner, Table, Tooltip, useOverlayState } from "@heroui/react";
import { ConnectorMessage, ConnectorMessageDetails, ConnectorMessageEvidence } from "@/types/response/message";
import { formatBytes, formatDate, getBooleanColor, getDeliveryLabel, saveFile, toastError, truncate } from "@/utils";
import React, { useEffect, useState } from "react";
import { Eye } from "@gravity-ui/icons";
import { getMessage } from "@/services/message";
import { DetailRow } from "@/components/common/detail-row";
import { DetailSection } from "@/components/common/detail-section";
import { ConnectorParty } from "@/types/response/processing-mode";
import { ArrowDownToLine } from "lucide-react";
import { downloadEvidence } from "@/services/evidence";

interface MessageDetailsViewProps {
    message: ConnectorMessage | null;
    state: ReturnType<typeof useOverlayState>;
}

export function MessageDetailsView({ message, state }: MessageDetailsViewProps) {
    const [details, setDetails] = useState<ConnectorMessageDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDownloadEvidenceClicked = async (evidence: ConnectorMessageEvidence) => {
        try {
            const file = await downloadEvidence(evidence.uuid, evidence.type)
            saveFile(file);
        } catch (error) {
            toastError(error);
        }
    }

    const detailParty = (party: ConnectorParty) => {
        return `${party.identifier}(${party.identifierType})`
    }

    const identifier = message?.identifier;

    useEffect(() => {
        if (!state.isOpen || !identifier) {
            return;
        }

        let active = true;

        (async () => {
            setLoading(true);
            setError(null);
            setDetails(null);
            try {
                const data = await getMessage(identifier);

                if (!active) {
                    return;
                }

                setDetails(data);
            } catch (e) {
                if (!active) {
                    return;
                }

                toastError(e)
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [state.isOpen, identifier]);

    return (
        <Modal state={state}>
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-300">
                        <Modal.Header>
                            <Modal.Icon className="bg-default text-foreground">
                                <Eye className="size-5"/>
                            </Modal.Icon>
                            <Modal.Heading className="font-semibold">Message Details</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            {message && (
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
                                        <DetailRow label="Direction" value={message.direction}/>
                                        <DetailRow
                                            label="Status"
                                            value={
                                                <Chip color={getBooleanColor(message.delivered)}
                                                      size="sm" variant="soft">
                                                    <Chip.Label>{getDeliveryLabel(message.delivered)}</Chip.Label>
                                                </Chip>
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
                                        <DetailRow label="Delivered to Gateway at"
                                                   value={formatDate(message.deliveredToGatewayAt)}/>
                                        <DetailRow label="Delivered to Backend at"
                                                   value={formatDate(message.deliveredToBackendAt)}/>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center py-6">
                                            <Spinner size="sm"/>
                                        </div>
                                    ) : (
                                        <>
                                            {details && !loading && (
                                                <>

                                                    <DetailSection
                                                        title="Business Content"
                                                        isEmpty={!details?.businessContent}
                                                        emptyLabel="Not Yet Implemented."
                                                    >
                                                        <DetailRow label="N/A" value="N/A"/>
                                                    </DetailSection>

                                                    <DetailSection
                                                        title="Attachments"
                                                        isEmpty={!details.attachments?.length}
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
                                                                        {details.attachments.map((attachment) => (
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
                                                        isEmpty={!details.evidences?.length}
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
                                                                        {details.evidences.map((evidence) => (
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
                                                        isEmpty={!details.errors?.length}
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
                                                                        {details.errors.map((error, i) => (
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
                                                </>
                                            )}
                                        </>
                                    )}

                                    {error && (
                                        <div className="flex justify-center py-6">
                                            <div className="text-destructive">{error}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button slot="close" variant="tertiary">Close</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

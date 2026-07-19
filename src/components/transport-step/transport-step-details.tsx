/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorTransportStepResponse } from "@/types/response/transport-step";
import { DetailRow } from "@/components/common/detail-row";
import { formatDate } from "@/utils";
import { Table } from "@heroui/react";
import { DetailSection } from "@/components/common/detail-section";
import { TransportStepMessageTypeChip } from "@/components/message/chip/message-type-chip";
import { TransportDeliveryStatusChip } from "@/components/transport-step/transport-step-status-chip";

interface TransportStepDetailsProps {
    transportStep: ConnectorTransportStepResponse;
}

export function TransportStepDetails({ transportStep }: TransportStepDetailsProps) {
    return (
        <div className="flex flex-col">
            <div>
                <DetailRow label="Identifier" value={transportStep.identifier}/>
                <DetailRow label="Transported Message ID" value={transportStep.transportedMessageIdentifier}/>
                <DetailRow label="Link Partner Name" value={transportStep.linkPartnerName}/>
                <DetailRow label="Remote System Identifier" value={transportStep.remoteSystemIdentifier}/>
                <DetailRow label="Message Type" value={
                    <TransportStepMessageTypeChip messageType={transportStep.messageType}/>
                }/>
                <DetailRow label="Attempts" value={transportStep.numberOfAttempts}/>
                <DetailRow
                    label="Status"
                    value={
                        <TransportDeliveryStatusChip status={transportStep.status}/>
                    }
                />
                <DetailRow label="Created at" value={formatDate(transportStep.createdAt)}/>
                <DetailRow label="Updated at" value={formatDate(transportStep.updatedAt)}/>
            </div>

            <DetailSection
                title="Status history"
                isEmpty={!transportStep.statuses?.length}
                emptyLabel="No status history available."
            >
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Transport step history">
                            <Table.Header>
                                <Table.Column isRowHeader>Status</Table.Column>
                                <Table.Column>Created at</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {transportStep.statuses.map((status, i) => (
                                    <Table.Row key={`${status.status}-${i}`}>
                                        <Table.Cell>
                                            <TransportDeliveryStatusChip status={status.status}/>
                                        </Table.Cell>
                                        <Table.Cell>{formatDate(status.createdAt)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </DetailSection>
        </div>
    );
}

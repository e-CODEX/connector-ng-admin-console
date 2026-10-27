/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Modal, Table } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { toastError } from "@/utils";
import { EmptyState } from "@/components/common/empty-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { useMessageService } from "@/hooks/use-http-service";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";

export function MessagePendingContent() {
    const messageService = useMessageService();
    const [loading, setLoading] = useState(true);
    const [messageIds, setMessageIds] = useState<string[]>([]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await messageService.listPendingMessages();
                if (!cancelled) setMessageIds(data.messageIds);
            } catch (error) {
                if (!cancelled) toastError(error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [messageService]);

    return (
        <Modal.Body className="flex flex-1 flex-col">
            {loading ? (
                <SpinnerView className="mt-60" />
            ) : (
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Pending messages">
                            <Table.Header>
                                <Table.Column isRowHeader>Message Transport Step Identifier </Table.Column>
                            </Table.Header>
                            <Table.Body
                                renderEmptyState={() => (
                                    <EmptyState text="No pending messages" className="py-10" />
                                )}
                            >
                                {messageIds.map((id) => (
                                    <Table.Row key={id}>
                                        <Table.Cell>
                                            <CopyableIdentifier identifier={id} visibleChars={100}/>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            )}
        </Modal.Body>
    );
}

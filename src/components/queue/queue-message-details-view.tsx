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

import React, { useCallback, useEffect, useState } from "react";
import type { useOverlayState } from "@heroui/react";
import { Button, Chip, Modal, Tabs } from "@heroui/react";
import { Mail, RotateCcw, Trash2 } from "lucide-react";
import type { ConnectorQueueMessageDetail } from "@/types/response/queue";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";
import { DetailRow } from "@/components/common/detail-row";
import { DetailSection } from "@/components/common/detail-section";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DateTime } from "@/components/common/date-time";
import { SpinnerView } from "@/components/common/spinner-view";
import { LoadErrorState } from "@/components/common/load-error-state";
import { QueueMessageBody } from "@/components/queue/queue-message-body";

interface QueueMessageDetailsViewProps {
    state: ReturnType<typeof useOverlayState>;
    messageId: string | null;
    load: (messageId: string) => Promise<ConnectorQueueMessageDetail>;
    onReplay?: (messageId: string) => void;
    onDelete?: (messageId: string) => void;
}

export function QueueMessageDetailsView({ state, messageId, load, onReplay, onDelete }: QueueMessageDetailsViewProps) {
    return (
        <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Modal.Container size="lg" scroll="inside">
                <Modal.Dialog className="sm:max-w-200">
                    <Modal.CloseTrigger />

                    <Modal.Header>
                        <ModalHeaderIcon icon={Mail} tone="accent" />
                        <Modal.Heading className="font-semibold">JMS Message details</Modal.Heading>
                    </Modal.Header>

                    <Modal.Body>{messageId && <MessageDetailsContent key={messageId} messageId={messageId} load={load} />}</Modal.Body>

                    {messageId && (onReplay || onDelete) && (
                        <Modal.Footer>
                            {onDelete && (
                                <Button variant="danger-soft" onPress={() => onDelete(messageId)}>
                                    <Trash2 className="size-4" />
                                    Delete
                                </Button>
                            )}
                            {onReplay && (
                                <Button variant="primary" onPress={() => onReplay(messageId)}>
                                    <RotateCcw className="size-4" />
                                    Replay
                                </Button>
                            )}
                        </Modal.Footer>
                    )}
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}

function MessageDetailsContent({ messageId, load }: { messageId: string; load: QueueMessageDetailsViewProps["load"] }) {
    const [detail, setDetail] = useState<ConnectorQueueMessageDetail | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [generalHeight, setGeneralHeight] = useState<number>();

    const measureGeneral = useCallback((node: HTMLDivElement | null) => {
        if (!node) return;
        const observer = new ResizeObserver(([entry]) => setGeneralHeight(entry.contentRect.height));
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadError(false);
            setDetail(null);
            try {
                const result = await load(messageId);
                if (!cancelled) setDetail(result);
            } catch {
                if (!cancelled) setLoadError(true);
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageId, attempt]);

    if (loadError) {
        return (
            <LoadErrorState
                title="Could not load the message"
                description="It may have been consumed, replayed or deleted in the meantime."
                onRetry={() => setAttempt((count) => count + 1)}
                className="py-8"
            />
        );
    }

    if (!detail) {
        return <SpinnerView className="py-16" />;
    }

    const { message } = detail;
    const properties = Object.entries(message.properties ?? {}).sort(([a], [b]) => a.localeCompare(b));

    return (
        <Tabs className="w-full" defaultSelectedKey="general">
            <Tabs.ListContainer>
                <Tabs.List aria-label="Message details sections">
                    <Tabs.Tab id="general" className="whitespace-nowrap">
                        General
                        <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="body" className="whitespace-nowrap">
                        Body
                        <Tabs.Indicator />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel id="general" className="pt-4">
                <div ref={measureGeneral} className="flex flex-col">
                    <DetailRow label="Message ID" value={<CopyableIdentifier identifier={message.messageId} iconPosition="right" visibleChars={100} />} />
                    <DetailRow
                        label="Correlation ID"
                        value={message.correlationId ? <CopyableIdentifier identifier={message.correlationId} iconPosition="right" visibleChars={100} /> : "—"}
                    />
                    <DetailRow label="Timestamp" value={<DateTime value={message.timestamp} precision="millis" />} />
                    <DetailRow label="Type" value={message.messageType || "—"} />
                    <DetailRow
                        label="Redelivered"
                        value={
                            <Chip size="sm" variant="soft" color={message.redelivered ? "warning" : "default"}>
                                <Chip.Label>{message.redelivered ? "Yes" : "No"}</Chip.Label>
                            </Chip>
                        }
                    />
                    <DetailRow label="Delivery count" value={message.deliveryCount} />
                    {message.failureCause && (
                        <div className="border-b border-separator py-1.5">
                            <span className="font-semibold text-muted">Failure cause</span>
                            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-danger">{message.failureCause}</p>
                        </div>
                    )}

                    <DetailSection title="Properties" isEmpty={properties.length === 0} emptyLabel="No properties.">
                        <div className="flex flex-col">
                            {properties.map(([name, value]) => (
                                <DetailRow key={name} label={name} value={<span className="font-mono text-xs">{String(value)}</span>} />
                            ))}
                        </div>
                    </DetailSection>
                </div>
            </Tabs.Panel>

            <Tabs.Panel id="body" className="pt-4">
                <div className="flex flex-col" style={{ height: generalHeight }}>
                    <QueueMessageBody detail={detail} />
                </div>
            </Tabs.Panel>
        </Tabs>
    );
}

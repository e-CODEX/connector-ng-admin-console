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

"use client";

import { Button, Chip, Modal, type useOverlayState } from "@heroui/react";
import { Info, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { DELIVERY_STATUS, DeliveryState } from "@/components/message/chip/message-delivery-status-chip";
import { ModalHeaderIcon } from "@/components/common/header/modal-header-icon";

const RETENTION_DAYS = 7;

function StatusChip({ state }: { state: DeliveryState }) {
    const { label, icon: Icon, color, variant } = DELIVERY_STATUS[state];
    return (
        <Chip color={color} variant={variant} size="sm">
            <Icon className="size-3.5"/>
            {label}
        </Chip>
    );
}

function NeutralChip({ children }: { children: ReactNode }) {
    return (
        <Chip color="default" variant="soft" size="sm">
            {children}
        </Chip>
    );
}

function Or() {
    return <span className="text-xs text-muted">or</span>;
}

interface TimelineStep {
    key: string;
    chips: ReactNode;
    text: ReactNode;
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
    return (
        <ol className="flex flex-col gap-4 border-l border-border pl-4">
            {steps.map((step) => (
                <li key={step.key} className="relative flex flex-col gap-1">
                    <span
                        aria-hidden
                        className="absolute -left-5.25 top-2 size-2 rounded-full bg-border"
                    />
                    <div className="flex flex-wrap items-center gap-2">{step.chips}</div>
                    <p className="text-sm text-muted">{step.text}</p>
                </li>
            ))}
        </ol>
    );
}

function Section({ title, subtitle, children, }: { title: string; subtitle?: string; children: ReactNode; }) {
    return (
        <section className="flex flex-col gap-3">
            <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
            </div>
            {children}
        </section>
    );
}

const OUTBOUND_STEPS: TimelineStep[] = [
    {
        key: "pending",
        chips: <StatusChip state="pending"/>,
        text: "The message is created and waits to be sent.",
    },
    {
        key: "submitted",
        chips: <StatusChip state="submitted"/>,
        text: "The message is submitted to the gateway.",
    },
    {
        key: "outcome",
        chips: (
            <>
                <StatusChip state="confirmed"/>
                <Or/>
                <StatusChip state="rejected"/>
            </>
        ),
        text: "The receiving connector answers with a confirmation or a rejection.",
    },
    {
        key: "deleted",
        chips: <StatusChip state="deleted"/>,
        text: (
            <>
                The message is then deleted, including its attachments, business content,
                business documents, and any detached signatures, while its metadata is retained.
            </>
        ),
    },
];

const INBOUND_STEPS: TimelineStep[] = [
    {
        key: "pending",
        chips: <StatusChip state="pending"/>,
        text: "The message is created and checked.",
    },
    {
        key: "rejected",
        chips: <StatusChip state="rejected"/>,
        text: "If the check fails, the message is rejected and goes no further.",
    },
    {
        key: "submitted",
        chips: <StatusChip state="submitted"/>,
        text: "Otherwise, the message is submitted to the backend.",
    },
    {
        key: "delivery",
        chips: (
            <>
                <StatusChip state="deliveredToBackend"/>
                <Or/>
                <NeutralChip>Not delivered</NeutralChip>
            </>
        ),
        text: "The backend reports whether the message was delivered.",
    },
    {
        key: "outcome",
        chips: (
            <>
                <StatusChip state="confirmed"/>
                <Or/>
                <StatusChip state="rejected"/>
            </>
        ),
        text: "The message is confirmed or rejected following the delivery outcome.",
    },
    {
        key: "deleted",
        chips: <StatusChip state="deleted"/>,
        text: (
            <>
                The message is considered deleted once its files are removed: attachments,
                business content, business document and any detached signature.
            </>
        ),
    },
];

interface MessageLifecycleViewProps {
    state: ReturnType<typeof useOverlayState>;
}

export function MessageLifecycleView({ state }: MessageLifecycleViewProps) {
    return (
        <Modal state={state}>
            <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-250 sm:min-h-200">
                        <Modal.CloseTrigger/>
                        <Modal.Header>
                            <ModalHeaderIcon icon={Info} tone="accent"/>
                            <Modal.Heading className="font-semibold">
                                Message lifecycle
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="flex flex-col gap-6">
                            <div className="grid gap-8 md:grid-cols-2">
                                <Section title="Outbound message" subtitle="Backend → Gateway">
                                    <Timeline steps={OUTBOUND_STEPS}/>
                                </Section>

                                <Section title="Inbound message" subtitle="Gateway → Backend">
                                    <Timeline steps={INBOUND_STEPS}/>
                                </Section>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-surface-secondary p-3">
                                <Timer
                                    className="mt-0.5 size-4 shrink-0 text-warning"
                                    aria-hidden
                                />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-semibold">
                                        {RETENTION_DAYS}-day timeout
                                    </h3>
                                    <p className="text-sm text-muted">
                                        If no confirmation or rejection arrives within{" "}
                                        {RETENTION_DAYS} days, its files are removed automatically and
                                        the message is considered <strong>Deleted</strong>.
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-muted">
                                <strong>Deleted</strong> and <strong>Rejected</strong> always take
                                precedence over the other states when both apply.
                            </p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onPress={state.close}>Got it</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

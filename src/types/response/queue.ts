/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export type CONNECTOR_QUEUE_STATS_CATEGORY = "CONNECTOR" | "GATEWAY";

export interface ConnectorQueueStats {
    queueName: string;
    queueDescription: string;
    pendingCount: number;
    dlqCount: number;
    category: CONNECTOR_QUEUE_STATS_CATEGORY;
}

export type ConnectorQueueMessageType = "MAP" | "TEXT" | "BYTES" | "OBJECT" | "STREAM" | "UNKNOWN";

export interface ConnectorQueueMessage {
    messageId: string;
    timestamp: string;
    correlationId: string;
    messageType: ConnectorQueueMessageType;
    redelivered: boolean;
    deliveryCount: number;
    failureCause: string;
    properties: Record<string, string>;
}

export interface ConnectorQueueReplayResult {
    replayed: string[];
    notFound: string[];
    failed: string[];
}

export interface ConnectorQueueMessageDetail {
    message: ConnectorQueueMessage;
    payload: Record<string, object>;
    text: string;
    truncated: boolean;
}

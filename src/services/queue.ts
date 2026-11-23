/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { RestApiCall } from "@/lib/rest";
import {
    type ConnectorQueueMessage,
    type ConnectorQueueMessageDetail,
    type ConnectorQueueReplayResult,
    type ConnectorQueueStats,
} from "@/types/response/queue";
import type { PaginatedResponse } from "@/types/response/paginated-response";

export type ListQueueMessagesParams = {
    page?: number;
    size?: number;
    queue?: string;
    dlq: boolean;
};

export type ReplayDLQueueMessageParams = {
    messageId: string; // jms message ID
    queue: string;
};

export type RetrieveQueueMessageParams = {
    queue: string;
    dlq: boolean;
};

export type ReplayDLQueueMessagesRequest = {
    messageIds: string[]; // jms message IDs
    queue: string;
};

export function createQueueService(baseUrl: string, call: RestApiCall) {
    return {
        async loadQueueStats(): Promise<ConnectorQueueStats[]> {
            return call<ConnectorQueueStats[]>(baseUrl, "api/v1/admin/jms/queues/stats");
        },
        async listQueueMessages(params: ListQueueMessagesParams): Promise<PaginatedResponse<ConnectorQueueMessage>> {
            return call<PaginatedResponse<ConnectorQueueMessage>>(baseUrl, "api/v1/admin/jms/queues/messages", {
                params,
            });
        },
        async listQueueDlqMessages(params: ListQueueMessagesParams): Promise<PaginatedResponse<ConnectorQueueMessage>> {
            return call<PaginatedResponse<ConnectorQueueMessage>>(baseUrl, "api/v1/admin/jms/queues/messages", {
                params,
            });
        },
        async replayDlqMessage(jmsMessageId: string, params: ReplayDLQueueMessageParams): Promise<void> {
            return call<void>(
                baseUrl,
                `api/v1/admin/jms/queues/dlq/messages/${encodeURIComponent(jmsMessageId)}/replay`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params,
                },
            );
        },
        async replayDlqMessages(payload: ReplayDLQueueMessagesRequest): Promise<ConnectorQueueReplayResult[]> {
            return call<ConnectorQueueReplayResult[]>(baseUrl, `api/v1/admin/jms/queues/dlq/replay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        },
        async deleteDlqQueueMessage(jmsMessageId: string, queue: string): Promise<void> {
            return call<void>(baseUrl, `api/v1/admin/jms/queues/dlq/messages/${encodeURIComponent(jmsMessageId)}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                params: { queue },
            });
        },
        async retrieveQueueMessage(
            jmsMessageId: string,
            params: RetrieveQueueMessageParams,
        ): Promise<ConnectorQueueMessageDetail> {
            // Read-only: a GET (not DELETE), so viewing a message never removes it from the queue.
            return call<ConnectorQueueMessageDetail>(
                baseUrl,
                `api/v1/admin/jms/queues/messages/${encodeURIComponent(jmsMessageId)}`,
                {
                    params,
                },
            );
        },
    };
}

export type QueueService = ReturnType<typeof createQueueService>;

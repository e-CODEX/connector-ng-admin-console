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
import { type ConnectorQueueMessage, type ConnectorQueueStats } from "@/types/response/queue";
import type { PaginatedResponse } from "@/types/response/paginated-response";

export type ListQueueMessagesParams = {
    page?: number;
    size?: number;
    queue?: string;
    dlq: boolean;
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
            return call<PaginatedResponse<ConnectorQueueMessage>>(baseUrl, "api/v1/admin/jms/queues/dlq-messages", {
                params,
            });
        },
    };
}

export type QueueService = ReturnType<typeof createQueueService>;

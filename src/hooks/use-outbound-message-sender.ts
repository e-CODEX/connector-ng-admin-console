/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { useCallback, useRef, useState } from "react";
import type { OutboundMessageConsoleContent } from "@/components/message/outbound/outbound-message-console-panel";
import type { SendMessageFormData, SendParameters } from "@/types/send-message-form";
import { useMessageService } from "@/hooks/use-http-service";
import { toastError } from "@/utils";

const READY_LOG: OutboundMessageConsoleContent = { message: "Ready.", level: "INFO" };

export type LogLevel = OutboundMessageConsoleContent["level"];

const pluralizeMessages = (count: number) => `${count} message${count === 1 ? "" : "s"}`;

const describeError = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function useOutboundMessageSender(asTestMessage: boolean) {
    const messageService = useMessageService();

    const [logs, setLogs] = useState<OutboundMessageConsoleContent[]>([{ message: "Ready.", level: "INFO" }]);
    const [isSending, setIsSending] = useState(false);

    const inFlight = useRef(false);

    const log = useCallback((message: string, level: LogLevel = "INFO") => {
        setLogs((prev) => [...prev, { message: `[${new Date().toLocaleTimeString()}] ${message}`, level }]);
    }, []);

    const clearLogs = useCallback(() => setLogs([READY_LOG]), []);

    const submitMessage = useCallback(
        async (messageFormData: SendMessageFormData, parameters: SendParameters) => {
            if (inFlight.current) return;
            inFlight.current = true;
            setIsSending(true);

            const repeatCount = Math.max(1, parameters.repeatCount || 1);
            log(`Sending ${pluralizeMessages(repeatCount)}...`);

            try {
                await messageService.sendMessage({
                    messageFormData: messageFormData,
                    parameters: { ...parameters, repeatCount },
                    asTestMessage,
                });
                log(`${pluralizeMessages(repeatCount)} sent`, "SUCCESS");
            } catch (error) {
                log(`Send failed: ${describeError(error)}`, "ERROR");
                toastError(error);
            } finally {
                inFlight.current = false;
                setIsSending(false);
            }
        },
        [messageService, asTestMessage, log],
    );

    return { logs, log, clearLogs, isSending, submitMessage };
}

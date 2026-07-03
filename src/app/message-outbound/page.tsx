"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-hearder";
import { MessageOutboundForm } from "@/components/message/outbound/message-outbound-form";
import { SendParametersSection } from "@/components/message/outbound/message-send-params-section";
import { MessageActionBar } from "@/components/message/outbound/message-action-bar";
import { MessageConsolePanel } from "@/components/message/outbound/message-console-panel";
import {
    SendMessageFormData,
    SendParameters,
} from "@/types/send-message-form";
import { sendMessage } from "@/services/message";

const initialMessageFormData: SendMessageFormData = {
    businessDomainIdentifier: "",
    backendMessageIdentifier: "",
    backendName: "backend_alice",
    as4Properties: {
        ebmsMessageIdentifier: "",
        referenceToIdentifier: "",
        conversationIdentifier: "",
        originalSender: "alice",
        finalRecipient: "bob",
        fromParty: {
            name: "",
            identifier: "BL",
            identifierType: "urn:oasis:names:tc:ebcore:partyid-type:ecodex",
            role: "GW",
            roleType: "",
            isHome: true,
        },
        toParty: {
            name: "",
            identifier: "RE",
            identifierType: "urn:oasis:names:tc:ebcore:partyid-type:ecodex",
            role: "GW",
            roleType: "",
            isHome: false,
        },
        service: {
            name: "EPO",
            type: "urn:e-codex:services:",
        },
        action: {
            name: "Form_A",
        },
    },
};

const initialSendParameters: SendParameters = {
    mode: "SOAP",
    attachmentSizeMB: 1,
    repeatCount: 1,
};

export default function MessageOutboundPage() {
    const [messageFormData, setMessageFormData] =
        useState<SendMessageFormData>(initialMessageFormData);

    const [sendParameters, setSendParameters] =
        useState<SendParameters>(initialSendParameters);

    const [logs, setLogs] = useState("Ready.");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        try {
            setLogs((prev) => `[${new Date().toLocaleTimeString()}] Sending...\n${prev}`);

            await sendMessage({
                formData: messageFormData,
                parameters: sendParameters,
            });

            setLogs((prev) => `[${new Date().toLocaleTimeString()}] Message sent\n${prev}`);
        } catch (error) {
            setLogs((prev) => `[${new Date().toLocaleTimeString()}] Send failed\n${prev}`);
        }
    };

    const handleSaveAsXml = () => {
        setLogs((prev) => `[${new Date().toLocaleTimeString()}] Save as XML clicked\n${prev}`);
    };

    return (
        <>
            <PageHeader
                icon="boxicons:send"
                title="Send Bussiness Message"
                subtitle="Send a business message to a party"
            >
                <MessageActionBar
                    onSend={handleSend}
                    onSaveAsXml={handleSaveAsXml}
                />
            </PageHeader>

            <div className="space-y-3">
                <MessageOutboundForm
                    data={messageFormData}
                    onChange={setMessageFormData}
                />

                <SendParametersSection
                    data={sendParameters}
                    onChange={setSendParameters}
                />

                <MessageConsolePanel content={logs} />
            </div>
        </>
    );
}

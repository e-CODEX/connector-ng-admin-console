"use client";

import {useState} from "react";
import {PageHeader} from "@/components/common/page-header";
import {OutboundMessageForm} from "@/components/message/outbound/outbound-message-form";
import {OutboundMessageSendParametersSection} from "@/components/message/outbound/outbound-message-send-params-section";
import {OutboundMessageActionBar} from "@/components/message/outbound/outbound-message-action-bar";
import {OutboundMessageConsolePanel} from "@/components/message/outbound/outbound-message-console-panel";
import {
    FileSourceMode,
    PayloadGenerationMode,
    RequestMode,
    SendMessageFormData,
    SendParameters,
} from "@/types/send-message-form";
import {sendMessage} from "@/services/message";
import {toastError} from "@/utils";

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
    mode: RequestMode.SOAP,
    attachmentSizeMB: 1,
    repeatCount: 1,
    submitterThreads: 5,
    generatorThreads: 3,
    reuseFiles: true,
    fileSource: FileSourceMode.GENERATED,
    payloadGenerationMode: PayloadGenerationMode.SEQUENTIAL
};

export default function MessageOutboundPage() {
    const [messageFormData, setMessageFormData] =
        useState<SendMessageFormData>(initialMessageFormData);

    const [sendParameters, setSendParameters] =
        useState<SendParameters>(initialSendParameters);

    const [logs, setLogs] = useState("Ready.");
    const [isSending, setIsSending] = useState(false);
    const [files, setFiles] = useState<File[]>([]);


    const handleSend = async () => {
        try {
            setIsSending(true);
            setLogs((prev) => `[${new Date().toLocaleTimeString()}] Sending...\n${prev}`);

            const documentsAsBlobs: Blob[] = [...files];
            await sendMessage({
                formData: messageFormData,
                parameters: sendParameters,
                documents: documentsAsBlobs
            });

            setLogs((prev) => `[${new Date().toLocaleTimeString()}] Message sent\n${prev}`);
        } catch (error) {
            setLogs((prev) => `[${new Date().toLocaleTimeString()}] Send failed\n${prev}`);
            toastError(error)
        } finally {
            setIsSending(false);
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
                <OutboundMessageActionBar
                    onSend={handleSend}
                    isSending={isSending}
                    onSaveAsXml={handleSaveAsXml}
                />
            </PageHeader>

            <div className="space-y-3">
                <OutboundMessageForm
                    data={messageFormData}
                    onChange={setMessageFormData}
                />

                <OutboundMessageSendParametersSection
                    data={sendParameters}
                    onChange={setSendParameters}
                    onFilesSelect={setFiles}
                />

                <OutboundMessageConsolePanel content={logs}/>
            </div>
        </>
    );
}

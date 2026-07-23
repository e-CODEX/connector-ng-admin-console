/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { BusinessContentRow } from "@/components/business-document/business-content-row";
import { FileCode, FileText, Signature } from "lucide-react";
import { formatBytes } from "@/utils";
import { BusinessDocumentAesTypeChip } from "@/components/business-document/business-document-aes-type-chip";
import { ConnectorMessageBusinessContent } from "@/types/response/message";
import { ConnectorAttachmentResponse } from "@/types/response/attachments";

interface BusinessContentSectionProps {
    businessContent: ConnectorMessageBusinessContent
    onAttachmentDetailsClick: (attachment: ConnectorAttachmentResponse) => void;
}

export function BusinessDetailsBusinessContentSection({ businessContent, onAttachmentDetailsClick }: BusinessContentSectionProps) {
    if (!businessContent) {
        return null;
    }

    const { xmlContent, businessDocument } = businessContent;
    const { attachment, aesType, detachedSignature } = businessDocument;

    return (
        <div className="overflow-hidden rounded-xl border">
            <BusinessContentRow
                icon={FileCode}
                name={xmlContent.name}
                meta={`${xmlContent.contentType} · ${formatBytes(xmlContent.size)} · structured payload`}
                onDetailsPress={() => onAttachmentDetailsClick(xmlContent)}
            />

            <BusinessContentRow
                icon={FileText}
                name={attachment.name}
                meta={`${attachment.contentType} · ${formatBytes(attachment.size)} · business document`}
                badge={<BusinessDocumentAesTypeChip aesType={aesType} size="sm"/>}
                onDetailsPress={() => onAttachmentDetailsClick(attachment)}
            />

            {detachedSignature ? (
                <BusinessContentRow
                    isNested
                    icon={Signature}
                    name={detachedSignature.name}
                    meta={`${detachedSignature.mimeType} · detached signature of ${attachment.name}`}
                />
            ) : null}
        </div>
    );
}

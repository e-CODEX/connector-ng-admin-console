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
import type { ConnectorMessageBusinessContent } from "@/types/response/message";
import type { ConnectorAttachmentResponse } from "@/types/response/attachments";

interface BusinessContentSectionProps {
    businessContent: ConnectorMessageBusinessContent
    onAttachmentDetailsClick: (attachment: ConnectorAttachmentResponse) => void;
}

export function BusinessDetailsBusinessContentSection({ businessContent, onAttachmentDetailsClick }: BusinessContentSectionProps) {
    if (!businessContent) {
        return null;
    }

    const { xmlContent, businessDocument } = businessContent;
    const { content, aesType, detachedSignature } = businessDocument;

    return (
        <div className="overflow-hidden rounded-xl border">
            <BusinessContentRow
                icon={FileCode}
                name={xmlContent.name}
                meta={`${xmlContent.contentType} · ${formatBytes(xmlContent.size)} · structured payload`}
                deletedAt={xmlContent.deletedAt}
                showDeletedAt={true}
                onDetailsPress={() => onAttachmentDetailsClick(xmlContent)}
            />

            <BusinessContentRow
                icon={FileText}
                name={content.name}
                meta={`${content.contentType} · ${formatBytes(content.size)} · business document`}
                badge={<BusinessDocumentAesTypeChip aesType={aesType} size="sm"/>}
                deletedAt={content.deletedAt}
                showDeletedAt={true}
                onDetailsPress={() => onAttachmentDetailsClick(content)}
            />

            {detachedSignature ? (
                <BusinessContentRow
                    isNested
                    icon={Signature}
                    name={detachedSignature.name}
                    meta={`${detachedSignature.contentType} · detached signature of ${content.name}`}
                    deletedAt={detachedSignature.deletedAt}
                    showDeletedAt={true}
                    onDetailsPress={() => onAttachmentDetailsClick(detachedSignature)}
                />
            ) : null}
        </div>
    );
}

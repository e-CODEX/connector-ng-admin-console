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

import React from "react";
import { ConnectorProcessingMode } from "@/types/response/processing-mode";
import { DetailRow } from "@/components/common/detail-row";
import { CopyableIdentifier } from "@/components/common/copyable-identifier";
import { DateTime } from "@/components/common/date-time";

interface ProcessingModeDetailsProps {
    processingMode: ConnectorProcessingMode;
    className?: string;
}

export function ProcessingModeDetailHeaderSection({ processingMode, className = "" }: ProcessingModeDetailsProps) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 ${className}`.trim()}>
            <DetailRow
                label="Identifier"
                value={<CopyableIdentifier identifier={processingMode.uuid} iconPosition="right"/>}/>
            <DetailRow label="Business domain" value={processingMode.businessDomainIdentifier}/>
            <DetailRow label="Description" value={processingMode.description}/>
            <DetailRow label="Filename" value={processingMode.filename}/>
            <DetailRow label="Created at" value={<DateTime value={processingMode.createdAt} precision="second"/>}/>
            <DetailRow label="Updated at" value={<DateTime value={processingMode.updatedAt} precision="second"/>}/>
        </div>
    );
}

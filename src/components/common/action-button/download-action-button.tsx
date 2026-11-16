/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import React from "react";
import { ArrowDownToLine } from "lucide-react";
import type { DetailButtonProps } from "@/components/common/action-button/action-button";
import { ActionButton } from "@/components/common/action-button/action-button";

export function DownloadActionButton({ ...buttonProps }: DetailButtonProps) {
    return (
        <ActionButton label="Download" icon={ArrowDownToLine} {...buttonProps} />
    )
}

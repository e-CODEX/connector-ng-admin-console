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

import { Button, Spinner } from "@heroui/react";
import { FloppyDisk, PaperPlane } from "@gravity-ui/icons";

interface OutboundMessageActionBarProps {
    isSending?: boolean;
    onSend?: () => void;
    onSaveAsXml?: () => void;
}

export function OutboundMessageActionBar({
                                     isSending = false,
                                     onSend,
                                     onSaveAsXml,
                                 }: OutboundMessageActionBarProps) {
    return (
        <div className="flex flex-wrap gap-3 justify-end">
            <Button
                variant="primary"
                className="font-semibold"
                isPending={isSending}
                onPress={onSend}>

                {isSending ? <Spinner color="current" size="sm"/> : <PaperPlane className="mr-2 size-4"/>}
                {isSending ? "Sending..." : "Send message"}
            </Button>

            <Button
                variant="secondary"
                className="font-semibold"
                isDisabled={isSending}
                onPress={onSaveAsXml}>
                <FloppyDisk className="mr-2 size-4"/>
                Save as XML
            </Button>
        </div>
    );
}

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
import { Send } from "lucide-react";

interface OutboundMessageActionBarProps {
    formId: string;
    isSending?: boolean;
    onSubmit?: () => void;
}

export function OutboundMessageActionBar({ isSending = false, onSubmit, formId }: OutboundMessageActionBarProps) {
    return (
        <div className="flex flex-wrap gap-3 justify-end">
            <Button
                type="submit"
                form={formId}
                variant="primary"
                className="font-semibold"
                isPending={isSending}
                onPress={onSubmit}>

                {isSending ? <Spinner color="current" size="sm"/> : <Send className="mr-2 size-4"/>}
                {isSending ? "Sending..." : "Send message"}
            </Button>
        </div>
    );
}

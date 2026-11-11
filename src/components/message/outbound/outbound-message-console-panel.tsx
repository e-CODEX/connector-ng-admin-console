/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { Button, Tooltip } from "@heroui/react";
import { Eraser } from "lucide-react";

interface OutboundMessageConsolePanelProps {
    contents?: OutboundMessageConsoleContent[];
    onClear?: () => void;
}

export interface OutboundMessageConsoleContent {
    message: string;
    level: "INFO" | "ERROR" | "WARNING" | "SUCCESS";
}

const LEVEL_TEXT_COLOR: Record<OutboundMessageConsoleContent["level"], string> = {
    INFO: "text-white",
    ERROR: "text-red-400",
    WARNING: "text-amber-400",
    SUCCESS: "text-green-400",
};

const DEFAULT_CONTENT: OutboundMessageConsoleContent = { message: "Ready.", level: "INFO" };

export function OutboundMessageConsolePanel({
                                                contents = [DEFAULT_CONTENT],
                                                onClear,
                                            }: OutboundMessageConsolePanelProps) {
    return (
        <div className="relative">
            {onClear && contents.length > 1 && (
                <Tooltip delay={300}>
                    <Button
                        isIconOnly
                        aria-label="Clear console"
                        variant="danger"
                        onPress={onClear}
                        className="absolute top-2 right-6 z-10"
                    >
                        <Eraser />
                    </Button>
                    <Tooltip.Content placement="left">
                        <p>Clear console</p>
                    </Tooltip.Content>
                </Tooltip>
            )}
            <pre className="h-56 overflow-y-auto bg-black px-4 py-4 font-mono text-sm font-semibold whitespace-pre-wrap">
                {contents.map((content, index) => (
                    <div key={index} className={LEVEL_TEXT_COLOR[content.level]}>
                        {content.message}
                    </div>
                ))}
            </pre>
        </div>
    );
}

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

import { Label, ListBox, Select, } from "@heroui/react";
import type { OutboundMessageRequestMode } from "@/types/global";

interface ModeSelectFieldProps {
    value: OutboundMessageRequestMode;
    onChange: (value: OutboundMessageRequestMode) => void;
    isDisabled?: boolean;
}

export function OutboundMessageRequestModeSelector({ value, onChange, isDisabled = false }: ModeSelectFieldProps) {
    return (
        <div className="w-full">
            <Label className="text-sm font-semibold text-default-700">Request Mode</Label>

            <Select
                aria-label="Mode"
                value={value}
                isDisabled={isDisabled}
                onChange={(key) => {
                    if (key) {
                        onChange(key as OutboundMessageRequestMode);
                    }
                }}
            >
                <Select.Trigger>
                    <Select.Value/>
                    <Select.Indicator/>
                </Select.Trigger>

                <Select.Popover>
                    <ListBox>
                        <ListBox.Item key="SOAP" id="SOAP" textValue="SOAP">
                            SOAP
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                        <ListBox.Item key="REST" id="REST" textValue="REST">
                            REST
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                    </ListBox>
                </Select.Popover>
            </Select>
        </div>
    );
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { FieldError, Key, Label, ListBox, Select } from "@heroui/react";
import { ConnectorProcessingModeService } from "@/types/response/processing-mode";

export interface ProcessingModeServiceSelectorProps {
    services: ConnectorProcessingModeService[];
    value?: string | null;
    onValueChange: (service: ConnectorProcessingModeService | null) => void;
    label?: string;
    showType?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}

const keyOf = (service: ConnectorProcessingModeService) => service.name;

export function ProcessingModeServiceSelector({
                                                  services,
                                                  value,
                                                  onValueChange,
                                                  label = "Service",
                                                  showType = false,
                                                  isRequired = false,
                                                  isDisabled,
                                                  className = "min-w-70",
                                              }: ProcessingModeServiceSelectorProps) {
    const handleChange = (key: Key | null) => {
        onValueChange(services.find((service) => keyOf(service) === key) ?? null);
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            isRequired={isRequired}
            isDisabled={isDisabled}
            className={className}
            placeholder="Select a service"
        >
            <Label className="font-semibold">{label}</Label>
            <Select.Trigger>
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {services.map((service) => {
                        const id = keyOf(service);
                        return (
                            <ListBox.Item key={id} id={id} textValue={service.name}>
                                {showType ? (
                                    `${service.name} (${service.type})`
                                ) : (
                                    service.name
                                )}
                                <ListBox.ItemIndicator/>
                            </ListBox.Item>
                        );
                    })}
                </ListBox>
            </Select.Popover>
            <FieldError/>
        </Select>
    );
}

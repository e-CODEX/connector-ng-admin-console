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
import { useEffect, useMemo } from "react";

export interface ProcessingModeServiceSelectorProps {
    services: ConnectorProcessingModeService[];
    name?: string;
    value?: string | null;
    onValueChange: (service: ConnectorProcessingModeService | null) => void;
    label?: string;
    showType?: boolean;
    onlyTestServices?: boolean;
    autoSelectSingle?: boolean;
    isRequired?: boolean;
    isDisabled?: boolean;
    className?: string;
}

export const serviceKeyOf = (service: Pick<ConnectorProcessingModeService, "name">) => service.name;

export function ProcessingModeServiceSelector({
                                                  services,
                                                  value,
                                                  name,
                                                  onValueChange,
                                                  label = "Service",
                                                  showType = false,
                                                  onlyTestServices = false,
                                                  autoSelectSingle = true,
                                                  isRequired = false,
                                                  isDisabled = false,
                                                  className = "min-w-70",
                                              }: ProcessingModeServiceSelectorProps) {
    const visibleServices = useMemo(
        () => (onlyTestServices ? services.filter((service) => service.testOnly) : services),
        [services, onlyTestServices],
    );

    useEffect(() => {
        if (isDisabled || visibleServices.length === 0) return; // empty list = still loading, don't touch the value
        const isValueVisible = value != null && visibleServices.some((service) => serviceKeyOf(service) === value);
        if (isValueVisible) return;
        if (autoSelectSingle && visibleServices.length === 1) {
            onValueChange(visibleServices[0]);
        } else if (value) {
            onValueChange(null);
        }
    }, [autoSelectSingle, isDisabled, visibleServices, value, onValueChange]);


    const handleChange = (key: Key | null) => {
        onValueChange(visibleServices.find((service) => serviceKeyOf(service) === key) ?? null);
    }

    return (
        <Select
            name={name}
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
                    {visibleServices.map((service) => {
                        const id = serviceKeyOf(service);
                        return (
                            <ListBox.Item key={id} id={id} textValue={service.name}>
                                {showType ? `${service.name} (${service.type})` : service.name}
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

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { FieldError, Label, ListBox, Select } from "@heroui/react";
import type { ConnectorUserRole } from "@/types/response/user";
import type { USER_ROLE } from "@/types/global";

interface UserRoleSelectorProps {
    roles: ConnectorUserRole[];
    isLoading?: boolean;
    loadError?: boolean;
    value: string[];
    onValueChange: (roles: USER_ROLE[]) => void;
    label?: string;
    isRequired?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
    isDisabled?: boolean;
    className?: string;
}

export function UserRoleSelector({
                                     roles,
                                     isLoading = false,
                                     loadError = false,
                                     value,
                                     onValueChange,
                                     label = "User roles",
                                     isRequired = false,
                                     isInvalid = false,
                                     errorMessage,
                                     isDisabled,
                                     className = "min-w-70",
                                 }: UserRoleSelectorProps) {
    return (
        <Select
            aria-label={label}
            selectionMode="multiple"
            value={value}
            onChange={(keys) => onValueChange(keys as USER_ROLE[])}
            isRequired={isRequired}
            isInvalid={isInvalid}
            isDisabled={isDisabled || isLoading}
            className={className}
            placeholder={isLoading ? "Loading roles..." : "Select user roles"}
        >
            <Label className="font-semibold">{label}</Label>
            <Select.Trigger className="flex-1">
                <Select.Value/>
                <Select.Indicator/>
            </Select.Trigger>
            <Select.Popover>
                <ListBox renderEmptyState={() => (loadError ? "Failed to load roles" : "No roles available")}>
                    {roles.map((role) => (
                        <ListBox.Item key={role.name} id={role.name} textValue={role.name}>
                            {role.name}
                            <ListBox.ItemIndicator/>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
            <FieldError>{errorMessage}</FieldError>
        </Select>
    );
}

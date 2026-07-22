/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { FieldError, Input, Label, TextField } from "@heroui/react";

interface FormTextFieldProps {
    label: string;
    value: string;
    required?: boolean;
    type?: "text" | "number";
    onChange?: (value: string) => void;
    isReadOnly?: boolean;
}

export function FormTextField({ label, value = "", type = "text", required = false, isReadOnly = false, onChange }: FormTextFieldProps) {
    return (
        <TextField
            value={value}
            onChange={onChange}
            isRequired={required}
            className="w-full"
            isReadOnly={isReadOnly}
        >
            <Label className="text-sm font-semibold text-default-700">{label}</Label>
            <Input type={type}/>
            <FieldError />
        </TextField>
    );
}

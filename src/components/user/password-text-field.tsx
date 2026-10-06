"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button, FieldError, InputGroup, Label, TextField } from "@heroui/react";

interface PasswordFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    isInvalid?: boolean;
    errorMessage?: string;
    isRequired?: boolean;
    name?: string;
}

export function PasswordField({
                                  label,
                                  value,
                                  onChange,
                                  onBlur,
                                  isInvalid,
                                  errorMessage,
                                  isRequired,
                                  name,
                              }: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <TextField
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={isInvalid}
            isRequired={isRequired}
        >
            <Label>{label}</Label>
            <InputGroup>
                <InputGroup.Input type={isVisible ? "text" : "password"} />
                <InputGroup.Suffix className="pr-0">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        onPress={() => setIsVisible((v) => !v)}
                    >
                        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                </InputGroup.Suffix>
            </InputGroup>
            <FieldError>{errorMessage}</FieldError>
        </TextField>
    );
}
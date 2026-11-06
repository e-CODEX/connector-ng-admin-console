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

import { Button, FieldError, Form, Input, Label, Spinner, TextField } from "@heroui/react";
import React, { useState } from "react";
import { LoginRequest } from "@/types/request/user";
import { loginSchema } from "@/schemas/auth";
import { toastErrorMessage } from "@/utils";
import { LockOpen } from "lucide-react";

const FORM_ID = "login-form";

const FAILED_LOGIN_MESSAGE = "Login failed. Please try again later.";
const BACKEND_UNREACHABLE_MESSAGE = "The connector backend is unreachable. Please try again in a moment.";

type FieldErrors = Partial<Record<keyof LoginRequest, string>>;

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        const result = loginSchema.safeParse({ username, password });
        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof LoginRequest | undefined;
                if (key && !fieldErrors[key]) {
                    fieldErrors[key] = issue.message;
                }
            }
            setErrors(fieldErrors);
            return;
        }
        setErrors({});

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json().catch(() => ({}));
                window.location.assign(data.mustChangePassword ? "/change-password" : "/");
                return; // keep the spinner while the browser navigates
            }

            if (res.status === 401) {
                toastErrorMessage("Invalid username or password.");
            } else if (res.status === 502 || res.status === 503 || res.status === 504) {
                toastErrorMessage(BACKEND_UNREACHABLE_MESSAGE);
            } else {
                toastErrorMessage(FAILED_LOGIN_MESSAGE);
            }
        } catch {
            // The app server itself could not be reached.
            toastErrorMessage(FAILED_LOGIN_MESSAGE);
        }
        setLoading(false);
    };

    return (
        <div className="flex grow items-center justify-center">
            <div className="w-full max-w-sm px-4">
                <Form
                    id={FORM_ID}
                    onSubmit={handleSubmit}
                    validationBehavior="aria"
                    validationErrors={errors}
                    className="flex flex-col gap-4"
                >
                    <TextField
                        autoFocus
                        isRequired
                        value={username}
                        onChange={setUsername}
                        isInvalid={!!errors.username}
                    >
                        <Label>Username</Label>
                        <Input placeholder="e.g. admin" autoComplete="username"/>
                        <FieldError>{errors.username}</FieldError>
                    </TextField>

                    <TextField
                        isRequired
                        value={password}
                        onChange={setPassword}
                        isInvalid={!!errors.password}
                    >
                        <Label>Password</Label>
                        <Input placeholder="e.g. *****" type="password" autoComplete="current-password"/>
                        <FieldError>{errors.password}</FieldError>
                    </TextField>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        form={FORM_ID}
                        variant="primary"
                        isDisabled={loading}
                    >
                        {loading ? <Spinner color="current" size="sm"/> : <LockOpen className="mr-2 size-4"/>}
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}

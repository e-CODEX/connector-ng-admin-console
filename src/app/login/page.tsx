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
import React, { useEffect, useState } from "react";
import { LoginRequest } from "@/types/request/user";
import { loginSchema } from "@/schemas/auth";
import { toastErrorMessage } from "@/utils";
import { LockOpen } from "lucide-react";

const FORM_ID = "login-form"

type FieldErrors = Partial<Record<keyof LoginRequest, string>>;

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<FieldErrors>({});

    const resetForm = () => {
        setUsername("");
        setPassword("");
        setErrors({})
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

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
                return;
            }
        } catch {
            toastErrorMessage("Invalid username or password.");
        } finally {
            setLoading(false);
        }

        setErrors({});
    }

    useEffect(() => {
        (async () => {
            resetForm()
        })()
    }, []);

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
                        isRequired
                        value={username}
                        onChange={setUsername}
                        isInvalid={!!errors.username}
                    >
                        <Label>Username</Label>
                        <Input placeholder="e.g. admin"/>
                        <FieldError>{errors.username}</FieldError>
                    </TextField>

                    <TextField
                        autoFocus
                        isRequired
                        value={password}
                        onChange={setPassword}
                        isInvalid={!!errors.password}
                    >
                        <Label>Password</Label>
                        <Input placeholder="e.g. *****" type="password"/>
                        <FieldError>{errors.password}</FieldError>
                    </TextField>

                    <br/>

                    <Button
                        type="submit"
                        className="w-full"
                        form={FORM_ID}
                        variant="primary"
                        isDisabled={!username.trim() || !password.trim() || loading}
                    >
                        {loading ? <Spinner color="current" size="sm"/> : <LockOpen className="mr-2 size-4"/>}
                        Login
                    </Button>
                </Form>
            </div>
        </div>
    );
}

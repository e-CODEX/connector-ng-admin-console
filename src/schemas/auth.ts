/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(12, { error: "Password must be at least 12 characters" })
    .regex(/[a-z]/, { error: "Password must have at least one lowercase letter" })
    .regex(/[A-Z]/, { error: "Password must have at least one uppercase letter" })
    .regex(/[0-9]/, { error: "Password must have at least one digit" })
    .regex(/[^A-Za-z0-9]/, { error: "Password must have at least one special character" })
    .regex(/^\S+$/, { error: "No spaces allowed" });

export const userCreationSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: passwordSchema,
    email: z
        .email()
        .trim()
        .min(1, "Email is required"),
    enabled: z.boolean(),
    roles: z.array(z.string()).min(1, "Select at least one role"),
});

export const userEditionSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    email: z
        .email()
        .trim()
        .min(1, "Email is required"),
    enabled: z.boolean(),
});

export const userRoleEditionSchema = z.object({
    roles: z.array(z.string()).min(1, "Select at least one role")
});

export const loginSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, { error: "Current password is required" }),
        newPassword: passwordSchema,
        confirmPassword: z.string().min(1, { error: "Please confirm your new password" }),
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
        error: "New password must differ from the current password",
        path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

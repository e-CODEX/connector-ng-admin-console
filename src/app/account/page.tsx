/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

"use client"

import React, { useEffect, useState } from "react";
import { Button, useOverlayState } from "@heroui/react";
import { KeyRound, Pencil, User } from "lucide-react";
import { ConnectorUser } from "@/types/response/user";
import { useAuthService } from "@/hooks/use-http-service";
import { toastError, toastErrorMessage, toastSuccess } from "@/utils";
import { DateTime } from "@/components/common/date-time";
import { PageHeader } from "@/components/common/header/page-header";
import { RoleChip } from "@/components/user/user-role-chip";
import { UserEditionView } from "@/components/user/edition/user-edition-view";
import { UserPasswordEditionView } from "@/components/user/password-edition/user-password-edition-view";
import { ChangePasswordRequest, UserEditionRequest } from "@/types/request/user";
import { BooleanChip } from "@/components/common/boolean-chip";
import { LoadErrorState } from "@/components/common/load-error-state";

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
            <dt className="w-40 shrink-0 text-sm font-medium text-neutral-500">{label}</dt>
            <dd className="min-w-0 wrap-break-word text-sm">{children}</dd>
        </div>
    );
}

function AccountSkeleton() {
    return (
        <div
            aria-busy="true"
            aria-label="Loading account"
            className="animate-pulse space-y-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
        >
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800"/>
                <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800"/>
                    <div className="h-3 w-56 rounded bg-neutral-200 dark:bg-neutral-800"/>
                </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"/>
            ))}
        </div>
    );
}

export default function AccountPage() {
    const [user, setUser] = useState<ConnectorUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const authService = useAuthService();

    const editModal = useOverlayState();
    const editPasswordModal = useOverlayState();

    useEffect(() => {
        let cancelled = false;

        authService
            .me()
            .then((me) => {
                if (cancelled) return;
                setUser(me);
                setLoadFailed(false);
            })
            .catch((error) => {
                if (cancelled) return;
                setLoadFailed(true);
                toastError(error);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [reloadToken, authService]);

    const reload = () => setReloadToken((t) => t + 1);

    const retry = () => {
        setLoading(true);
        reload();
    };

    const handleEditionSubmission = async (payload: UserEditionRequest): Promise<void> => {
        if (!user || submitting) return;
        setSubmitting(true);

        try {
            const updated = await authService.editMe(payload.username, payload.email);
            editModal.close();
            toastSuccess(`User [${updated.username}] updated successfully`);
            reload();
        } catch (error) {
            toastError(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordEditionSubmission = async (payload: ChangePasswordRequest): Promise<void> => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: payload.currentPassword,
                    newPassword: payload.newPassword,
                }),
            });

            if (res.ok) {
                // The session is invalidated server-side: force a full reload to /login.
                window.location.assign("/login");
                return;
            }
            toastErrorMessage("Could not change password. Check your current password.");
        } catch {
            toastErrorMessage("Unable to reach the server.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader icon={User} title="My Account" subtitle="Manage my user account"/>

            {loading && !user && <AccountSkeleton/>}

            {!loading && !user && loadFailed && (
                <LoadErrorState
                    title="Could not load account information"
                    description="Something went wrong while contacting the server. Check your connection and try again."
                    onRetry={retry}
                />
            )}

            {user && (
                <>
                    <section className="rounded-xl border border-neutral-200 p-6 shadow-sm dark:border-neutral-800">
                        <header className="mb-4 flex flex-wrap items-center gap-4">
                            <div
                                aria-hidden
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold uppercase dark:bg-neutral-800"
                            >
                                {user.username.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-medium">{user.username}</h2>
                                <p className="truncate text-sm text-neutral-500">{user.email}</p>
                            </div>
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.enabled
                                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                }`}
                            >
                                {user.enabled ? "Enabled" : "Disabled"}
                            </span>

                            <div className="ml-auto flex gap-2">
                                <Button variant="secondary" onPress={editModal.open}>
                                    <Pencil size={16}/>
                                    Edit info
                                </Button>
                                <Button variant="secondary" onPress={editPasswordModal.open}>
                                    <KeyRound size={16}/>
                                    Change password
                                </Button>
                            </div>
                        </header>

                        <dl className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            <InfoRow label="User ID">
                                <code className="text-xs">{user.uuid}</code>
                            </InfoRow>
                            <InfoRow label="Username">{user.username}</InfoRow>
                            <InfoRow label="Email">{user.email}</InfoRow>
                            <InfoRow label="Roles">
                                <div className="flex flex-wrap gap-2">
                                    {!user.roles?.length && <span className="text-neutral-500">None</span>}
                                    {user.roles?.map((role) => (
                                        <RoleChip key={role} role={role}/>
                                    ))}
                                </div>
                            </InfoRow>
                            <InfoRow label="Must change password">
                                <BooleanChip value={user.mustChangePassword}/>
                            </InfoRow>
                            <InfoRow label="Created">
                                <DateTime value={user.createdAt} precision="second"/>
                            </InfoRow>
                            <InfoRow label="Last updated">
                                <DateTime value={user.updatedAt} precision="second"/>
                            </InfoRow>
                        </dl>
                    </section>

                    <UserEditionView
                        key={user.updatedAt}
                        state={editModal}
                        user={user}
                        onSubmit={handleEditionSubmission}
                    />
                    <UserPasswordEditionView
                        state={editPasswordModal}
                        onSubmit={handlePasswordEditionSubmission}
                    />
                </>
            )}
        </div>
    );
}

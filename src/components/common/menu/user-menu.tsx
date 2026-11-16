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

import { useRouter } from "next/navigation";
import { Avatar, Description, Dropdown, Label, Separator } from "@heroui/react";
import { LogOut, User, Users } from "lucide-react";
import React from "react";
import { toastErrorMessage } from "@/utils";
import type { NavUser } from "@/hooks/use-last-known-user";
import { forgetUser } from "@/hooks/use-last-known-user";

const LOGOUT_FAILED_MESSAGE = "Logout Failed";

const MANAGE_USERS_LABEL = "Manage users";
const MANAGE_MY_ACCOUNT_LABEL = "My account";
const LOGOUT_LABEL = "Sign out";

const USERS_ID = "users";
const ACCOUNT_ID = "account";
const LOGOUT_ID = "logout";

function getInitials(name: string): string {
    const parts = name.trim().split(/[\s._-]+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
}

async function logout() {
    try {
        const response = await fetch("/api/auth/logout", { method: "POST" });

        if (!response.ok) {
            toastErrorMessage(`${LOGOUT_FAILED_MESSAGE}. Status code : [(${response.status})]`);
        }
    } catch {
        toastErrorMessage(LOGOUT_FAILED_MESSAGE);

        return;
    }

    forgetUser();

    window.location.assign("/login");
}

export function UserMenu({ user }: { user: NavUser }) {
    const router = useRouter();
    const isAdmin = user.roles?.includes("ROLE_ADMIN");

    function onAction(key: React.Key) {
        switch (key) {
            case USERS_ID:
                router.push("/admin/users");
                break;
            case ACCOUNT_ID:
                router.push("/account");
                break;
            case LOGOUT_ID:
                void logout();
                break;
        }
    }

    return (
        <Dropdown>
            <Dropdown.Trigger className="rounded-full outline-none" aria-label="User menu">
                <Avatar>
                    <Avatar.Fallback delayMs={600}>{getInitials(user.username)}</Avatar.Fallback>
                </Avatar>
            </Dropdown.Trigger>

            <Dropdown.Popover className="min-w-56">
                <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                    <Avatar size="sm">
                        <Avatar.Fallback delayMs={600}>{getInitials(user.username)}</Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium leading-5">{user.username}</p>
                        {user.email && <p className="text-muted text-xs leading-none">{user.email}</p>}
                    </div>
                </div>

                <Dropdown.Menu onAction={onAction}>
                    <Dropdown.Item id={ACCOUNT_ID} textValue={MANAGE_MY_ACCOUNT_LABEL} variant="default">
                        <User className="size-4 shrink-0"/>
                        <div className="flex flex-col">
                            <Label>{MANAGE_MY_ACCOUNT_LABEL}</Label>
                            <Description>View and edit your profile</Description>
                        </div>
                    </Dropdown.Item>

                    {isAdmin && (
                        <>
                            <Separator/>
                            <Dropdown.Item id={USERS_ID} textValue={MANAGE_USERS_LABEL} variant="default">
                                <Users className="size-4 shrink-0"/>
                                <div className="flex flex-col">
                                    <Label>{MANAGE_USERS_LABEL}</Label>
                                    <Description>Create, edit and disable accounts</Description>
                                </div>
                            </Dropdown.Item>
                        </>
                    )}

                    <Separator/>

                    <Dropdown.Item id={LOGOUT_ID} textValue={LOGOUT_LABEL} variant="danger">
                        <LogOut className="size-4 shrink-0 text-danger"/>
                        <Label>{LOGOUT_LABEL}</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}

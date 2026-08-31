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
import { LogOut, User } from "lucide-react";
import { useOptionalUser } from "@/hooks/useUser";
import React from "react";
import { toastErrorMessage } from "@/utils";

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function UserMenu() {
    const user = useOptionalUser();
    const router = useRouter();
    if (!user) return null;

    async function onAction(key: React.Key) {
        switch (key) {
            case "users":
                router.push("/admin/users");
                break;
            case "logout":
                const res = await fetch("/api/auth/logout", { method: "POST" });
                if (!res.ok) {
                    toastErrorMessage("Logout failed.");
                    return;
                }
                window.location.assign("/login");
                break;
        }
    }

    return (
        <Dropdown>
            <Dropdown.Trigger className="rounded-full outline-none">
                <Avatar>
                    <Avatar.Fallback delayMs={600}>
                        {getInitials(user.username)}
                    </Avatar.Fallback>
                </Avatar>
            </Dropdown.Trigger>

            <Dropdown.Popover className="min-w-56">
                <div className="flex items-center gap-2 px-3 pb-2 pt-3">
                    <Avatar size="sm">
                        <Avatar.Fallback delayMs={600}>
                            {getInitials(user.username)}
                        </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium leading-5">{user.username}</p>
                        {user.email && (
                            <p className="text-muted text-xs leading-none">{user.email}</p>
                        )}
                    </div>
                </div>

                <Separator/>

                <Dropdown.Menu onAction={onAction}>
                    {user.roles.includes("ROLE_ADMIN") && (
                        <Dropdown.Item id="users" textValue="Users" variant="default">
                            <div className="flex h-8 items-start justify-center pt-px">
                                <User className="size-4 shrink-0 text-blue-900"/>
                            </div>
                            <div className="flex flex-col">
                                <Label>Users Admin</Label>
                                <Description>Manage users</Description>
                            </div>
                        </Dropdown.Item>
                    )}

                    <Separator/>

                    <Dropdown.Item id="logout" textValue="Sign out" variant="danger">
                        <LogOut className="size-4 shrink-0 text-danger"/>
                        <Label>Sign out</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}

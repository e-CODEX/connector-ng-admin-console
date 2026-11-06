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

import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { Building2, Layers, LucideIcon, Mail, Paperclip, Route, Send, Settings, Workflow } from "lucide-react";
import { useOptionalUser } from "@/hooks/useUser";
import { UserMenu } from "@/components/common/menu/user-menu";
import { USER_ROLE } from "@/types/global";
import { useLastKnownUser } from "@/hooks/use-last-known-user";

const AUTH_ROUTES = ["/login", "/change-password"];

type MenuEntry = {
    label: string;
    href: string;
    icon: LucideIcon;
    roles?: USER_ROLE[];
};

const MENU: MenuEntry[] = [
    { label: "Send", href: "/message-outbound", icon: Send, roles: ["ROLE_ADMIN"] },
    { label: "Messages", href: "/admin/messages", icon: Mail, roles: ["ROLE_ADMIN"] },
    { label: "Transport-Step", href: "/admin/transport-steps", icon: Route, roles: ["ROLE_ADMIN"] },
    { label: "Attachments", href: "/admin/attachments", icon: Paperclip, roles: ["ROLE_ADMIN"] },
    { label: "Queues", href: "/admin/queues", icon: Layers, roles: ["ROLE_ADMIN"] },
    { label: "Configurations", href: "/admin/configurations", icon: Settings, roles: ["ROLE_ADMIN"] },
    { label: "Business domain", href: "/admin/business-domains", icon: Building2, roles: ["ROLE_ADMIN"] },
    { label: "Processing mode", href: "/admin/processing-modes", icon: Workflow, roles: ["ROLE_ADMIN"] },
];

export const AppMainNavbar = ({ backendDown = false }: { backendDown?: boolean }) => {
    const sessionUser = useOptionalUser();
    const lastKnownUser = useLastKnownUser();
    // The cache is only trusted during an outage, so a logged-out visitor never sees a stale menu.
    const user = sessionUser ?? (backendDown ? lastKnownUser : null);

    const pathname = usePathname();
    const onAuthPage = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
    const showUserChrome = !!user && !onAuthPage;

    const items = MENU.filter(
        (item) => !item.roles || item.roles.some((role) => user?.roles?.includes(role)),
    );

    return (
        <HeroNavbar
            className="fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white border-b border-slate-700 backdrop-blur-lg pr-5"
            maxWidth="2xl"
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand className="gap-3 max-w-fit">
                    <Link href="/" className="flex items-center">
                        <Image
                            className="rounded-md"
                            src="/logo.png"
                            alt="Logo"
                            loading="eager"
                            width={400}
                            height={80}
                        />
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden lg:flex gap-5" justify="end">
                {showUserChrome && items.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <NavbarItem key={href} isActive={isActive}>
                            <Link
                                href={href}
                                aria-current={isActive ? "page" : undefined}
                                className={`flex items-center gap-1.5 whitespace-nowrap transition-colors text-base font-medium pb-0.5 ${
                                    isActive
                                        ? "text-white font-semibold border-b-2 border-white"
                                        : "text-white/80 hover:text-white"
                                }`}
                            >
                                <Icon className="size-4 shrink-0" aria-hidden="true"/>
                                {label}
                            </Link>
                        </NavbarItem>
                    );
                })}

                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>

                {showUserChrome && user && (
                    <NavbarItem className="ml-auto">
                        <UserMenu user={user}/>
                    </NavbarItem>
                )}
            </NavbarContent>
        </HeroNavbar>
    );
};

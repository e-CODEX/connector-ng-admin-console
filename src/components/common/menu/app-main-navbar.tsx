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
import NextLink from "next/link"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { Building2, Layers, LucideIcon, Mail, Paperclip, Route, Send, Settings, Workflow } from "lucide-react";
import { useOptionalUser } from "@/hooks/useUser";
import { UserMenu } from "@/components/common/menu/user-menu";
import { USER_ROLE } from "@/types/global";

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

export const AppMainNavbar = () => {
    const user = useOptionalUser();
    const pathname = usePathname();

    const items = MENU.filter(
        (item) =>
            !item.roles ||
            item.roles.some((itemRole) => user?.roles.includes(itemRole))
    );

    return (
        <HeroNavbar
            className="fixed top-0 left-0 right-0 z-50 bg-slate-800 text-white border-b border-slate-700 backdrop-blur-lg pr-5"
            maxWidth="2xl"
        >
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand className="gap-3 max-w-fit">
                    <NextLink href="/" className="flex items-center">
                        <Image
                            className="rounded-md"
                            src="/logo.png"
                            alt="Logo"
                            loading="eager"
                            width={400}
                            height={80}
                        />
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden lg:flex gap-5" justify="end">
                {user && (
                    <>
                        {items.map(({ label, href, icon: Icon }) => {
                            const isActive = href === "/"
                                ? pathname === "/"
                                : pathname === href || pathname.startsWith(href + "/");
                            return (
                                <NavbarItem key={href} isActive={isActive}>
                                    <Link
                                        className={`flex items-center gap-1.5 whitespace-nowrap transition-colors text-base font-medium pb-0.5 ${
                                            isActive
                                                ? "text-white font-semibold border-b-2 border-white"
                                                : "text-white/80 hover:text-white"
                                        }`}
                                        href={href}
                                    >
                                        <Icon className="size-4 shrink-0" aria-hidden="true"/>
                                        {label}
                                    </Link>
                                </NavbarItem>
                            );
                        })}
                    </>
                )}

                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>

                <div className="ml-auto">
                    <UserMenu/>
                </div>
            </NavbarContent>
        </HeroNavbar>
    )
}

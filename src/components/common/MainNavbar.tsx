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

const navItems = [
    { label: "Send", href: "/message-outbound" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Transport-Step", href: "/admin/transport-steps" },
    { label: "Attachments", href: "/admin/attachments" },
    { label: "Configurations", href: "/admin/configurations" },
    { label: "Business domain", href: "/admin/business-domains" },
    { label: "Processing mode", href: "/admin/processing-modes" },
]
export const MainNavbar = () => {
    const pathname = usePathname();

    return (
        <HeroNavbar
            className="bg-slate-800 backdrop-blur-lg text-white border-b border-slate-700 pr-5"
            maxWidth="2xl"
            position="sticky"
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
                {navItems.map((item) => {
                    const isActive = item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href || pathname.startsWith(item.href + "/")

                    return (
                        <NavbarItem key={item.href} isActive={isActive}>
                            <Link
                                className={`whitespace-nowrap transition-colors text-base font-medium pb-0.5 ${
                                    isActive
                                        ? "text-white font-semibold border-b-2 border-white"
                                        : "text-white/80 hover:text-white"
                                }`}
                                href={item.href}
                            >
                                {item.label}
                            </Link>
                        </NavbarItem>
                    );
                })}
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
            </NavbarContent>
        </HeroNavbar>
    )
}

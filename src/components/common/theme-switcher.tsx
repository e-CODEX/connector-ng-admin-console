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

import { useTheme } from "next-themes";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "@gravity-ui/icons";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    // Render a stable placeholder until mounted to avoid hydration mismatch
    if (!mounted) {
        return <Button isIconOnly variant="ghost" aria-label="Toggle theme"/>;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            isIconOnly
            variant="ghost"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onPress={() => setTheme(isDark ? "light" : "dark")}
        >
            {isDark ? <Sun className="size-5 text-white"/> : <Moon className="size-5 text-white"/>}
        </Button>
    );
}

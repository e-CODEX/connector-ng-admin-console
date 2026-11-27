/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import type { ReactNode } from "react";
import { Button, Card } from "@heroui/react";
import { FunnelX } from "lucide-react";
import clsx from "clsx";

interface SearchCriteriaProps {
    children: ReactNode;
    title?: string;
    className?: string;
    onClear?: () => void;
    canClear?: boolean;
}

export function SearchCriteriaBox({ children, title = "Search criteria", className, onClear, canClear = true }: SearchCriteriaProps) {
    return (
        <Card variant="default" className={clsx("mt-6 mb-4", className)}>
            <Card.Header className="flex flex-row items-center justify-between gap-2">
                <Card.Title className="text-sm font-semibold">{title}</Card.Title>
                {onClear && (
                    <Button size="sm" variant="tertiary" aria-label="Clear search criteria" isDisabled={!canClear} onPress={onClear}>
                        <FunnelX className="size-4" />
                        Clear
                    </Button>
                )}
            </Card.Header>
            <Card.Content className="flex flex-col gap-3 sm:flex-row sm:items-end">{children}</Card.Content>
        </Card>
    );
}

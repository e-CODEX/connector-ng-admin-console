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
import { Card } from "@heroui/react";
import clsx from "clsx";

interface SearchCriteriaProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export function SearchCriteriaBox({ children, title = "Search criteria", className }: SearchCriteriaProps) {
    return (
        <Card variant="default" className={clsx("mt-6 mb-4", className)}>
            <Card.Header>
                <Card.Title className="text-sm font-semibold">{title}</Card.Title>
            </Card.Header>
            <Card.Content className="flex flex-col gap-3 sm:flex-row sm:items-end">
                {children}
            </Card.Content>
        </Card>
    );
}

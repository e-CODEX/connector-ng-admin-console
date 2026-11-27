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

import React, { useEffect, useRef, useState } from "react";
import type { Key } from "@heroui/react";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Building2, Cog, FileText, Layers, type LucideIcon, Network, Package, RefreshCw, Road, Settings } from "lucide-react";
import { PageHeader } from "@/components/common/header/page-header";
import { PageHeaderButton } from "@/components/common/header/page-header-button";
import { ConfigurationEvidenceSection } from "@/components/configuration/section/configuration-evidence-section";
import { ConfigurationContainerSection } from "@/components/configuration/section/configuration-container-section";
import { ConfigurationBackendRulesSection } from "@/components/configuration/section/configuration-backend-rules-section";
import { ConfigurationJmsQueueSection } from "@/components/configuration/section/configuration-jms-queue-section";
import { ConfigurationMessageProcessingSection } from "@/components/configuration/section/configuration-message-processing-section";
import { ConfigurationLinkPartnerSection } from "@/components/configuration/section/configuration-link-partner-section";
import { ConfigurationBusinessDomainsSection } from "@/components/configuration/section/configuration-business-domains-section";
import { ConfigurationBusinessDocumentSection } from "@/components/configuration/section/configuration-business-document-section";
import { clearConfigurationCache } from "@/hooks/use-configuration";

interface ConfigurationTab {
    id: string;
    label: string;
    icon: LucideIcon;
    Section: React.ComponentType;
}

const TABS: ConfigurationTab[] = [
    { id: "business-domains", label: "Business domains", icon: Building2, Section: ConfigurationBusinessDomainsSection },
    { id: "link-partners", label: "Link partners", icon: Network, Section: ConfigurationLinkPartnerSection },
    { id: "message-processing", label: "Message processing", icon: Cog, Section: ConfigurationMessageProcessingSection },
    { id: "routing", label: "Routing", icon: Road, Section: ConfigurationBackendRulesSection },
    { id: "business-documents", label: "Business documents", icon: FileText, Section: ConfigurationBusinessDocumentSection },
    { id: "container", label: "Container", icon: Package, Section: ConfigurationContainerSection },
    { id: "evidence", label: "Evidence", icon: BadgeCheck, Section: ConfigurationEvidenceSection },
    { id: "jms-queues", label: "JMS queues", icon: Layers, Section: ConfigurationJmsQueueSection },
];

const DEFAULT_TAB = TABS[0].id;

export default function ConfigurationsAdminPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [reloadToken, setReloadToken] = useState(0);
    const tabsRef = useRef<HTMLDivElement>(null);

    const requestedTab = searchParams.get("tab");
    const selectedTab = TABS.some((tab) => tab.id === requestedTab) ? requestedTab! : DEFAULT_TAB;

    useEffect(() => {
        tabsRef.current?.querySelector('[role="tab"][aria-selected="true"]')?.scrollIntoView({ block: "nearest", inline: "center" });
    }, [selectedTab]);

    const onTabChange = (key: Key) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", String(key));
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const onRefresh = () => {
        clearConfigurationCache();
        setReloadToken((token) => token + 1);
    };

    return (
        <div>
            <PageHeader icon={Settings} title="Configurations" subtitle="Read-only view of the connector configuration">
                <PageHeaderButton variant="secondary" tooltip="Reload the configuration" icon={RefreshCw} onPress={onRefresh} />
            </PageHeader>

            <div ref={tabsRef}>
                <Tabs className="w-full" selectedKey={selectedTab} onSelectionChange={onTabChange}>
                    <Tabs.ListContainer className="overflow-x-auto">
                        <Tabs.List aria-label="Configuration sections">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <Tabs.Tab key={id} id={id} className="whitespace-nowrap">
                                    <span className="flex items-center gap-2">
                                        <Icon className="size-4 shrink-0" aria-hidden="true" />
                                        {label}
                                    </span>
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs.ListContainer>

                    {TABS.map(({ id, Section }) => (
                        <Tabs.Panel key={id} id={id} className="pt-4">
                            <Section key={reloadToken} />
                        </Tabs.Panel>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}

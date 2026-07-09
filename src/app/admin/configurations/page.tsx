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

import { PageHeader } from "@/components/common/page-header";
import { Tabs } from "@heroui/react";
import { ConfigurationEvidenceSection } from "@/components/configuration/section/configuration-evidence-section";
import { ConfigurationContainerSection } from "@/components/configuration/section/configuration-container-section";
import { ConfigurationBackendRulesSection } from "@/components/configuration/section/configuration-backend-rules-section";
import { ConfigurationJmsQueueSection } from "@/components/configuration/section/configuration-jms-queue-section";
import { ConfigurationMessageProcessingSection } from "@/components/configuration/section/configuration-message-processing-section";
import { ConfigurationLinkPartnerSection } from "@/components/configuration/section/configuration-link-partner-section";
import { ConfigurationBusinessDomainsSection } from "@/components/configuration/section/configuration-business-domains-section";
import { ConfigurationBusinessDocumentSection } from "@/components/configuration/section/configuration-business-document-section";

export default function ConfigurationsAdminPage() {
    return (
        <>
            <PageHeader
                icon="icon-park-outline:config"
                title="Configurations"
                subtitle="List of configurations"
            />
            <div className="flex flex-1 w-full flex-col">
                <Tabs className="w-full">
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Options">
                            <Tabs.Tab id="business-domain">
                                Business Domains
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="link-partners">
                                Link Partners
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="message-processing">
                                Message Processing
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="routings">
                                Routing
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="business-documents">
                                Business Documents
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="container">
                                Container
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="evidence">
                                Evidence
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="jms-queues">
                                JMS Queues
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                    <Tabs.Panel className="pt-4" id="business-domain">
                        <ConfigurationBusinessDomainsSection/>
                    </Tabs.Panel>
                    <Tabs.Panel className="pt-4" id="link-partners">
                        <ConfigurationLinkPartnerSection/>
                    </Tabs.Panel>
                    <Tabs.Panel className="pt-4" id="message-processing">
                        <ConfigurationMessageProcessingSection/>
                    </Tabs.Panel>
                    <Tabs.Panel className="pt-4" id="routings">
                        <ConfigurationBackendRulesSection/>
                    </Tabs.Panel>
                    <Tabs.Panel className="pt-4" id="business-documents">
                        <ConfigurationBusinessDocumentSection/>
                    </Tabs.Panel>
                    <Tabs.Panel className="pt-4" id="container">
                        <ConfigurationContainerSection/>
                    </Tabs.Panel>
                    <Tabs.Panel className="pt-4" id="evidence">
                        <ConfigurationEvidenceSection/>
                    </Tabs.Panel>
                    <Tabs.Panel className="pt-4" id="jms-queues">
                        <ConfigurationJmsQueueSection/>
                    </Tabs.Panel>
                </Tabs>
            </div>
        </>
    )
}

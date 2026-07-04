/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { PageHeader } from "@/components/common/page-hearder";
import { Tabs } from "@heroui/react";

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
                            <Tabs.Tab id="backend-partners">
                                Backend Partners
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="business-documents">
                                Business Documents
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="business-domain">
                                Business Domains
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
                            <Tabs.Tab id="message-processing">
                                Message Processing
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="jms-queues">
                                JMS Queues
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                            <Tabs.Tab id="routings">
                                Routing
                                <Tabs.Indicator/>
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>
            </div>
        </>
    )
}

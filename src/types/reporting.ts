/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export interface ConnectorMessageReport {
    services: string[];
    parties: string[];
    months: ReportMonthKey[];
    years: MessageYearReport[];
}

export interface ReportMonthKey {
    year: number
    month: string;
}

export interface MessageYearReport {
    year: number;
    months: MessageMonthReport[];
}

export interface MessageMonthReport {
    month: number;
    label: string;
    totalInbound: number;
    totalOutbound: number;
    total: number;
    reports: MessageReportItem[];
}

export interface MessageReportItem {
    party: string;
    service: string;
    outbound: number;
    inbound: number;
    total: number;
}

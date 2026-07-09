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

import { ConnectorMessageStatsItem } from "@/types/response/stats";
import { deliveryRate } from "@/utils";

export function MessageStatsDeliveryRateBar({ stats }: { stats: ConnectorMessageStatsItem }) {
    const calculatePercentage = (n: number) => (stats.total > 0 ? (n / stats.total) * 100 : 0);
    const label = `Delivered ${deliveryRate(stats)}%, pending ${stats.pending}, rejected ${stats.rejected}`;
    return (
        <div
            className="flex h-2 overflow-hidden rounded-full bg-default-100"
            role="img"
            aria-label={label}
        >
            <div className="bg-green-600" style={{ width: `${calculatePercentage(stats.delivered)}%` }}/>
            <div className="bg-warning" style={{ width: `${calculatePercentage(stats.pending)}%` }}/>
            <div className="bg-danger" style={{ width: `${calculatePercentage(stats.rejected)}%` }}/>
        </div>
    );
}

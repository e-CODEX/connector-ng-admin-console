/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ConnectorMessageReport } from "@/types/response/reporting";
import { useEffect, useMemo, useState } from "react";
import { MessageReportingKpi } from "@/components/dashboard/message/reporting/message-reporting-kpi";
import { MessageReportingTh } from "@/components/dashboard/message/reporting/message-reporting-th";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const IN = "#2563eb";   // inbound
const OUT = "#f59e0b";  // outbound
const AXIS = "#94a3b8";
const GRID = "rgba(148,163,184,0.25)";

interface MessageReportingStatsProps {
    payload: ConnectorMessageReport;
    refreshing?: boolean;
}

type FlatRow = {
    party: string; service: string;
    inbound: number; outbound: number; total: number;
    key: string;
};

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthName = (m: number) => MONTH_ABBR[m - 1] ?? String(m);
const keyOf = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`;


function normalize(payload: ConnectorMessageReport) {
    const flat: FlatRow[] = [];
    for (const y of payload.years ?? [])
        for (const m of y.months ?? [])
            for (const r of m.reports ?? [])
                flat.push({
                    party: r.party,
                    service: r.service,
                    inbound: r.inbound ?? 0,
                    outbound: r.outbound ?? 0,
                    total: r.total ?? (r.inbound ?? 0) + (r.outbound ?? 0),
                    key: keyOf(y.year, m.month),
                });

    const axis = (payload.months ?? []).map((mk) => {
        const monthNum = Number(mk.month);
        const nested = payload.years
            ?.find((y) => y.year === mk.year)
            ?.months?.find((mm) => mm.month === monthNum);
        return {
            key: keyOf(mk.year, monthNum),
            label: `${nested?.label ?? monthName(monthNum)} ${String(mk.year).slice(2)}`,
        };
    });

    return { flat, axis, services: payload.services ?? [] };
}

export function MessageReportingStats({ payload, refreshing }: MessageReportingStatsProps) {
    const { flat, axis, services } = useMemo(() => normalize(payload), [payload]);
    const options = useMemo(() => ["All", ...services], [services]);
    const [service, setService] = useState<string>(options[0]);
    const [sortKey, setSortKey] = useState<"id" | "inbound" | "outbound" | "total">("total");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    // keep selection valid if the service set changes on a later poll
    useEffect(() => {
        if (!options.includes(service)) setService(options[0]);
    }, [options, service]);

    const rows = useMemo(
        () => (service === "All" ? flat : flat.filter((r) => r.service === service)),
        [flat, service]
    );

    const monthly = useMemo(() => {
        const map = new Map(axis.map((a) => [a.key, { label: a.label, inbound: 0, outbound: 0 }]));
        for (const r of rows) {
            const b = map.get(r.key);
            if (b) {
                b.inbound += r.inbound;
                b.outbound += r.outbound;
            }
        }
        return [...map.values()];
    }, [rows, axis]);

    const parties = useMemo(() => {
        const map = new Map<string, { id: string; inbound: number; outbound: number }>();
        for (const r of rows) {
            const e = map.get(r.party) ?? { id: r.party, inbound: 0, outbound: 0 };
            e.inbound += r.inbound;
            e.outbound += r.outbound;
            map.set(r.party, e);
        }
        const list = [...map.values()].map((e) => ({ ...e, total: e.inbound + e.outbound }));
        list.sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            const d = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === "asc" ? d : -d;
        });
        return list;
    }, [rows, sortKey, sortDir]);

    const totalIn = monthly.reduce((s, m) => s + m.inbound, 0);
    const totalOut = monthly.reduce((s, m) => s + m.outbound, 0);
    const maxParty = Math.max(...parties.map((p) => Math.max(p.inbound, p.outbound)), 1);

    const setSort = (k: typeof sortKey) => {
        if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortKey(k);
            setSortDir("desc");
        }
    };
    const arrow = (k: typeof sortKey) => (k === sortKey ? (sortDir === "asc" ? " ↑" : " ↓") : "");

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <div className="inline-flex rounded-lg border border-default-200 bg-content1 p-1">
                    {options.map((s) => (
                        <button key={s} onClick={() => setService(s)}
                                aria-pressed={service === s}
                                className={`px-3 py-1.5 text-sm rounded-md transition ${
                                    service === s
                                        ? "bg-slate-800 text-white font-medium shadow-sm"
                                        : "text-default-600 hover:bg-default-100"
                                }`}>
                            {s}
                        </button>
                    ))}
                </div>
                {refreshing && <span className="text-xs text-default-400">updating…</span>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MessageReportingKpi label="Inbound" value={totalIn} dot={IN} sub="received"/>
                <MessageReportingKpi label="Outbound" value={totalOut} dot={OUT} sub="sent"/>
                <MessageReportingKpi label="Total" value={totalIn + totalOut}/>
                <MessageReportingKpi label="Parties" value={parties.length}/>
            </div>

            <div className="bg-content1 rounded-xl border border-default-200 p-4">
                <h2 className="text-sm font-semibold text-default-700 mb-3">Monthly volume</h2>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthly} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID}/>
                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false}/>
                        <YAxis tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false}/>
                        <Tooltip
                            contentStyle={{
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                background: "#ffffff",
                                color: "#1e293b",
                                fontSize: 13
                            }}
                            cursor={{ fill: "rgba(148,163,184,0.15)" }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }}/>
                        <Bar dataKey="inbound" name="Inbound" fill={IN} radius={[3, 3, 0, 0]} maxBarSize={28}/>
                        <Bar dataKey="outbound" name="Outbound" fill={OUT} radius={[3, 3, 0, 0]} maxBarSize={28}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-content1 rounded-xl border border-default-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-default-100">
                    <h2 className="text-sm font-semibold text-default-700">By Party</h2>
                </div>
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-xs text-default-400 border-b border-default-100">
                        <MessageReportingTh onClick={() => setSort("id")}>
                            Party{arrow("id")}
                        </MessageReportingTh>
                        <MessageReportingTh onClick={() => setSort("inbound")} align="right">
                            Inbound{arrow("inbound")}
                        </MessageReportingTh>
                        <MessageReportingTh onClick={() => setSort("outbound")} align="right">
                            Outbound{arrow("outbound")}
                        </MessageReportingTh>
                        <th className="px-4 py-2 font-medium w-2/5">Split</th>
                        <MessageReportingTh onClick={() => setSort("total")} align="right">
                            Total{arrow("total")}
                        </MessageReportingTh>
                    </tr>
                    </thead>
                    <tbody>
                    {parties.map((p) => (
                        <tr key={p.id} className="border-b border-default-50 hover:bg-default-50">
                            <td className="px-4 py-2.5 font-mono text-xs text-default-700">{p.id}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums">{p.inbound}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums">{p.outbound}</td>
                            <td className="px-4 py-2.5">
                                <div className="flex items-center gap-1 h-4">
                                    <div className="h-2 rounded-sm" style={{ width: `${(p.inbound / maxParty) * 50}%`, background: IN }}/>
                                    <div className="h-2 rounded-sm" style={{ width: `${(p.outbound / maxParty) * 50}%`, background: OUT }}/>
                                </div>
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium tabular-nums">{p.total}</td>
                        </tr>
                    ))}
                    {parties.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-default-400">No messages in this range.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

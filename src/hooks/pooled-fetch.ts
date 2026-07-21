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

import { DependencyList, useEffect, useRef, useState } from "react";

export interface PolledFetchResult<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    refreshing: boolean;
    refresh: () => void;
}

export function usePolledFetch<T>(
    fetcher: () => Promise<T>,
    intervalMs: number,
    deps: DependencyList = [],
): PolledFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Hold the latest fetcher without re-arming the interval on every render.
    const fetcherRef = useRef(fetcher);
    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    // Bridges the event handler to the effect-scoped loader.
    const refreshRef = useRef<() => void>(() => {
    });

    const depsKey = JSON.stringify(deps);

    useEffect(() => {
        let cancelled = false;
        let reqId = 0;

        const load = async (manual: boolean) => {
            const id = ++reqId;
            try {
                const result = await fetcherRef.current();
                if (cancelled || id !== reqId) return;
                setData(result);
                setError(null);
            } catch (e) {
                if (cancelled || id !== reqId) return;
                setError(e as Error);
            } finally {
                if (!cancelled && id === reqId) {
                    setLoading(false);
                    if (manual) setRefreshing(false);
                }
            }
        };

        refreshRef.current = () => {
            setRefreshing(true);
            void load(true);
        };

        void load(false);
        const timer = setInterval(() => void load(false), intervalMs);

        return () => {
            cancelled = true;
            clearInterval(timer);
            refreshRef.current = () => {
            };
        };
    }, [intervalMs, depsKey]);

    const refresh = () => refreshRef.current();

    return { data, error, loading, refreshing, refresh };
}

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

import { DependencyList, useCallback, useEffect, useRef, useState } from "react";

export interface PolledFetchResult<T> {
    data: T | null;
    error: Error | null;
    /** true only until the first result (or first error) arrives. */
    loading: boolean;
    /** true while a manual refresh() is in flight — for spin/disable on a button. */
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

    const mounted = useRef(true);
    const reqId = useRef(0);

    const load = useCallback(async (manual = false) => {
        const id = ++reqId.current; // any newer call invalidates this one
        if (manual) setRefreshing(true);
        try {
            const result = await fetcherRef.current();
            if (mounted.current && id === reqId.current) {
                setData(result);
                setError(null);
            }
        } catch (e) {
            if (mounted.current && id === reqId.current) {
                setError(e as Error);
            }
        } finally {
            if (mounted.current && id === reqId.current) {
                setLoading(false);
                if (manual) setRefreshing(false);
            }
        }
    }, []);

    const refresh = useCallback(() => void load(true), [load]);

    // Serialize deps into a stable key so filter changes retrigger without a
    // spread element in the dependency array (keeps exhaustive-deps quiet).
    const depsKey = JSON.stringify(deps);

    useEffect(() => {
        mounted.current = true;
        void load(false);
        const timer = setInterval(() => void load(false), intervalMs);
        return () => {
            mounted.current = false;
            clearInterval(timer);
        };
    }, [intervalMs, depsKey, load]);

    return { data, error, loading, refreshing, refresh };
}

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

import { useEffect, useRef, useState } from "react";

export interface List<T> {
    items: T[];
    loading: boolean;
    refreshing: boolean;
    loadError: boolean;
    refresh: () => Promise<void>;
    retry: () => void;
}

export function useList<T>(fetcher: () => Promise<T[]>, deps: unknown[] = []): List<T> {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [reload, setReload] = useState({ token: 0, silent: false });
    const [loadError, setLoadError] = useState(false);

    const fetcherRef = useRef(fetcher);
    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    const pendingRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!reload.silent) {
                setLoading(true);
            }

            setLoadError(false);

            try {
                const data = await fetcherRef.current();
                if (cancelled) return;
                setItems(data || []);
            } catch {
                if (cancelled) {
                    return;
                }

                setLoadError(true);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setRefreshing(false);
                }
                pendingRef.current?.();
                pendingRef.current = null;
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, ...deps]);

    const refresh = () =>
        new Promise<void>((resolve) => {
            pendingRef.current = resolve;
            setRefreshing(true);
            setReload((r) => ({ token: r.token + 1, silent: false }));
        });

    const retry = () => {
        setReload((r) => ({ token: r.token + 1, silent: false }));
    };

    return { items, loading, refreshing, loadError, refresh, retry };
}

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

export interface ConfigurationState<T> {
    data: T | null;
    loading: boolean;
    loadError: boolean;
    retry: () => void;
}

const cache = new Map<string, unknown>();

export function clearConfigurationCache() {
    cache.clear();
}

export function useConfiguration<T>(key: string, fetcher: () => Promise<T>): ConfigurationState<T> {
    const [data, setData] = useState<T | null>(() => (cache.get(key) as T | undefined) ?? null);
    const [loading, setLoading] = useState(() => !cache.has(key));
    const [loadError, setLoadError] = useState(false);
    const [attempt, setAttempt] = useState(0);

    const fetcherRef = useRef(fetcher);
    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    useEffect(() => {
        if (cache.has(key)) {
            return;
        }

        let cancelled = false;

        (async () => {
            setLoading(true);
            setLoadError(false);
            try {
                const result = await fetcherRef.current();
                if (cancelled) {
                    return;
                }

                cache.set(key, result);
                setData(result);
            } catch {
                if (!cancelled) {
                    setLoadError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [key, attempt]);

    return { data, loading, loadError, retry: () => setAttempt((count) => count + 1) };
}

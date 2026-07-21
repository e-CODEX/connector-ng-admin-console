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
import { toastError } from "@/utils";
import { PaginatedResponse } from "@/types/response/paginated-response";

export interface PagedListParams {
    page: number; // 0-based, ready for the API
    size: number;
}

export interface PagedList<T> {
    items: T[];
    totalElements: number;
    loading: boolean;
    refreshing: boolean;
    page: number;      // 1-based, ready for PaginationControls
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    refresh: () => void;
}

export function usePagedList<T>(
    fetcher: (params: PagedListParams) => Promise<PaginatedResponse<T>>,
    deps: unknown[] = [],
    initialPageSize = 20,
): PagedList<T> {
    const [items, setItems] = useState<T[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [reload, setReload] = useState({ token: 0, silent: false });

    // Keep the latest fetcher without making it a dependency.
    const fetcherRef = useRef(fetcher);
    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!reload.silent) {
                setLoading(true);
            }
            try {
                const data = await fetcherRef.current({ page: page - 1, size: pageSize });
                if (cancelled) return;

                setItems(data.content || []);
                setTotalElements(data.totalElements || 0);
            } catch (error) {
                if (cancelled) return;
                toastError(error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, reload, ...deps]);

    const changePageSize = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    const refresh = () => {
        setRefreshing(true);
        setReload((r) => ({ token: r.token + 1, silent: true }));
    };

    return {
        items,
        totalElements,
        loading,
        refreshing,
        page,
        pageSize,
        setPage,
        setPageSize: changePageSize,
        refresh,
    };
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { vi } from "vitest";
import type { usePagedList } from "@/hooks/use-paged-list";

type PagedList<T> = ReturnType<typeof usePagedList<T>>;

export const pagedState = <T>(
    overrides: Partial<PagedList<T>> = {},
): PagedList<T> =>
    ({
        items: [],
        loading: false,
        refreshing: false,
        loadError: null,
        page: 1,
        pageSize: 10,
        totalElements: 0,
        setPage: vi.fn(),
        setPageSize: vi.fn(),
        refresh: vi.fn(),
        retry: vi.fn(),
        ...overrides,
    }) as PagedList<T>;

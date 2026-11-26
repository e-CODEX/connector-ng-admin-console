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

import type { ReactNode } from "react";
import type { PagedList } from "@/hooks/use-paged-list";
import type { List } from "@/hooks/use-list";
import { LoadErrorState } from "@/components/common/load-error-state";
import { SpinnerView } from "@/components/common/spinner-view";
import { PaginationControls } from "@/components/paging/pagination-controls";

interface PagedListViewProps<T> {
    list: PagedList<T> | List<T>;
    errorMessage: string;
    pageSizeOptions?: number[];
    placeholderClassName?: string;
    children: ReactNode;
}

/** Handles the loading / error / refreshing states and the pagination footer around a paged list. */
export function PagedListView<T>({ list, errorMessage, pageSizeOptions, placeholderClassName = "min-h-[50vh]", children }: PagedListViewProps<T>) {
    const { items, loading, loadError, refreshing, retry } = list;

    if (loadError) {
        return <LoadErrorState title={errorMessage} onRetry={retry} className={placeholderClassName} />;
    }

    if (loading && items.length === 0) {
        return <SpinnerView className={placeholderClassName} />;
    }

    const busy = loading || refreshing;

    return (
        <>
            <div aria-busy={busy} className={`transition-opacity ${busy ? "pointer-events-none opacity-50" : ""}`}>
                {children}
            </div>

            {"totalElements" in list && list.totalElements > 0 && (
                <div className="mt-4 flex justify-center">
                    <PaginationControls
                        page={list.page}
                        pageSize={list.pageSize}
                        pageSizeOptions={pageSizeOptions}
                        totalElements={list.totalElements}
                        onPageChange={list.setPage}
                        onPageSizeChange={list.setPageSize}
                    />
                </div>
            )}
        </>
    );
}

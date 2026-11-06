/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

import { ListBox, Pagination, Select } from "@heroui/react";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    page: number;
    pageSize: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
    className?: string;
}

export function PaginationControls({
                                       page,
                                       pageSize,
                                       totalElements,
                                       onPageChange,
                                       onPageSizeChange,
                                       pageSizeOptions = [10, 20, 50, 100],
                                       className = "w-full",
                                   }: PaginationControlsProps) {
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const start = totalElements === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalElements);

    const handlePageSizeChange = (key: React.Key | null) => {
        if (key == null) return;
        onPageSizeChange(Number(key));
        onPageChange(1);
    };

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];

        pages.push(1);

        if (page > 3) {
            pages.push("ellipsis");
        }

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) {
            pages.push("ellipsis");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };


    return (
        <Pagination className={className}>
            <Pagination.Summary>
                <div className="flex items-center gap-4 pb-3">
                    <span>
                        Showing {start}-{end} of {totalElements} results
                    </span>

                    <Select
                        aria-label="Rows per page"
                        value={String(pageSize)}
                        onChange={handlePageSizeChange}
                        className="w-32"
                    >
                        <Select.Trigger>
                            <Select.Value/>
                            <Select.Indicator/>
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {pageSizeOptions.map((size) => (
                                    <ListBox.Item key={size} id={String(size)}
                                                  textValue={`${size} / page`}>
                                        {size} / page
                                        <ListBox.ItemIndicator/>
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>
            </Pagination.Summary>

            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous
                        isDisabled={page === 1}
                        onPress={() => onPageChange(page - 1)}
                    >
                        <Pagination.PreviousIcon>
                            <ChevronLeft/>
                        </Pagination.PreviousIcon>
                        <span>Back</span>
                    </Pagination.Previous>
                </Pagination.Item>

                {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                        <Pagination.Item key={`ellipsis-${i}`}>
                            <Pagination.Ellipsis/>
                        </Pagination.Item>
                    ) : (
                        <Pagination.Item key={`page-${p}-${i}`}>
                            <Pagination.Link isActive={p === page} onPress={() => onPageChange(p)}>
                                {p}
                            </Pagination.Link>
                        </Pagination.Item>
                    ),
                )}

                <Pagination.Item>
                    <Pagination.Next
                        isDisabled={page === totalPages}
                        onPress={() => onPageChange(page + 1)}
                    >
                        <span>Forward</span>
                        <Pagination.NextIcon>
                            <ChevronRight/>
                        </Pagination.NextIcon>
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
}

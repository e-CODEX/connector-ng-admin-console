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

import type { TimeValue} from "@heroui/react";
import { Button, DateField, DateRangePicker, Label, RangeCalendar, TimeField, useLocale } from "@heroui/react";
import type { DateValue, ZonedDateTime } from "@internationalized/date";
import { DateFormatter, getLocalTimeZone, isSameDay, now, Time, toCalendarDate } from "@internationalized/date";

export type DateTimeRangeGranularity = "day" | "hour" | "minute" | "second";

type HourCycle = 12 | 24;

const ClearIcon = () => {
    return (
        <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14"
             stroke="currentColor" strokeLinecap="round" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
    );
}

export type DateRange = {
    start: DateValue;
    end: DateValue;
};

export interface DateTimeRangeSelectorProps {
    label?: string;
    granularity?: DateTimeRangeGranularity;
    hourCycle?: HourCycle;
    hideTimeZone?: boolean;
    shouldForceLeadingZeros?: boolean;
    value?: DateRange | null;
    defaultValue?: DateRange | null;
    maxValue?: ZonedDateTime | null;
    onChange?: (value: DateRange | null) => void;
    startName?: string;
    endName?: string;
    className?: string;
    isDisabled?: boolean;
    showSelectedSummary?: boolean;
}

const tz = getLocalTimeZone();

export function DateTimeRangeSelector({
                                          label = "Select a date range",
                                          granularity = "second",
                                          hourCycle = 24,
                                          hideTimeZone = true,
                                          shouldForceLeadingZeros = false,
                                          value,
                                          defaultValue,
                                          maxValue,
                                          onChange,
                                          startName = "startDate",
                                          endName = "endDate",
                                          className = "w-max min-w-80",
                                          isDisabled,
                                          showSelectedSummary = true,
                                      }: DateTimeRangeSelectorProps) {
    const { locale } = useLocale();
    const resolvedMax = maxValue ??
        (granularity === "day"
            ? now(tz)
            : now(tz).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }));

    const maxDate = toCalendarDate(resolvedMax);

    const dateFormatter = new DateFormatter(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(granularity !== "day" && {
            hour: "numeric",
            minute: "numeric",
            hourCycle: hourCycle === 24 ? "h23" : "h12",
            ...(granularity === "second" && { second: "numeric" }),
        }),
    });

    const formatRange = (range: DateRange) => {
        const tz = getLocalTimeZone();

        return dateFormatter.formatRange(range.start.toDate(tz), range.end.toDate(tz));
    };

    const timeGranularity = granularity !== "day" ? granularity : undefined;
    const showTimeField = !!timeGranularity;

    return (
        <div className="">
            <DateRangePicker
                key={granularity}
                className={className}
                defaultValue={defaultValue ?? undefined}
                endName={endName}
                granularity={granularity}
                hideTimeZone={hideTimeZone}
                hourCycle={hourCycle}
                isDisabled={isDisabled}
                shouldForceLeadingZeros={shouldForceLeadingZeros}
                startName={startName}
                value={value}
                maxValue={resolvedMax}
                onChange={onChange}
            >
                {({ state }) => (
                    <>
                        <Label>{label}</Label>
                        <DateField.Group>
                            <DateField.InputContainer>
                                <DateField.Input slot="start">
                                    {(segment) => <DateField.Segment segment={segment}/>}
                                </DateField.Input>
                                <DateRangePicker.RangeSeparator/>
                                <DateField.Input slot="end">
                                    {(segment) => <DateField.Segment segment={segment}/>}
                                </DateField.Input>
                            </DateField.InputContainer>
                            <DateField.Suffix>
                                {!isDisabled && (state.value?.start || state.dateRange?.start) && (
                                    <Button
                                        isIconOnly
                                        aria-label="Clear date range"
                                        size="sm"
                                        variant="ghost"
                                        onPress={() => state.setValue(null)}
                                    >
                                        <ClearIcon/>
                                    </Button>
                                )}
                                <DateRangePicker.Trigger>
                                    <DateRangePicker.TriggerIndicator/>
                                </DateRangePicker.Trigger>
                            </DateField.Suffix>
                        </DateField.Group>

                        <DateRangePicker.Popover className="flex w-full max-w-63 flex-col gap-3">
                            <RangeCalendar aria-label={label} className="w-full" maxValue={maxDate}>
                                <RangeCalendar.Header>
                                    <RangeCalendar.YearPickerTrigger>
                                        <RangeCalendar.YearPickerTriggerHeading/>
                                        <RangeCalendar.YearPickerTriggerIndicator/>
                                    </RangeCalendar.YearPickerTrigger>
                                    <RangeCalendar.NavButton slot="previous"/>
                                    <RangeCalendar.NavButton slot="next"/>
                                </RangeCalendar.Header>
                                <RangeCalendar.Grid>
                                    <RangeCalendar.GridHeader>
                                        {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                                    </RangeCalendar.GridHeader>
                                    <RangeCalendar.GridBody>
                                        {(date) => <RangeCalendar.Cell date={date}/>}
                                    </RangeCalendar.GridBody>
                                </RangeCalendar.Grid>
                                <RangeCalendar.YearPickerGrid>
                                    <RangeCalendar.YearPickerGridBody>
                                        {({ year }) => <RangeCalendar.YearPickerCell year={year}/>}
                                    </RangeCalendar.YearPickerGridBody>
                                </RangeCalendar.YearPickerGrid>
                            </RangeCalendar>

                            {showTimeField && (() => {
                                const maxTime = new Time(resolvedMax.hour, resolvedMax.minute, resolvedMax.second);
                                const startIsMaxDay = !!state.dateRange?.start && isSameDay(state.dateRange.start, maxDate);
                                const endIsMaxDay = !!state.dateRange?.end && isSameDay(state.dateRange.end, maxDate);

                                return (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <Label>Start Time</Label>
                                            <TimeField
                                                aria-label="Start Time"
                                                granularity={timeGranularity}
                                                hideTimeZone={hideTimeZone}
                                                hourCycle={hourCycle}
                                                name="startTime"
                                                maxValue={startIsMaxDay ? maxTime : undefined}
                                                shouldForceLeadingZeros={shouldForceLeadingZeros}
                                                value={state.timeRange?.start ?? null}
                                                onChange={(v) =>
                                                    state.setTimeRange({
                                                        end: state.timeRange?.end as TimeValue,
                                                        start: v as TimeValue,
                                                    })
                                                }
                                            >
                                                <TimeField.Group variant="secondary">
                                                    <TimeField.Input>
                                                        {(segment) => <TimeField.Segment segment={segment}/>}
                                                    </TimeField.Input>
                                                </TimeField.Group>
                                            </TimeField>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label>End Time</Label>
                                            <TimeField
                                                aria-label="End Time"
                                                granularity={timeGranularity}
                                                hideTimeZone={hideTimeZone}
                                                hourCycle={hourCycle}
                                                name="endTime"
                                                maxValue={endIsMaxDay ? maxTime : undefined}
                                                shouldForceLeadingZeros={shouldForceLeadingZeros}
                                                value={state.timeRange?.end ?? null}
                                                onChange={(v) =>
                                                    state.setTimeRange({
                                                        end: v as TimeValue,
                                                        start: state.timeRange?.start as TimeValue,
                                                    })
                                                }
                                            >
                                                <TimeField.Group variant="secondary">
                                                    <TimeField.Input>
                                                        {(segment) => <TimeField.Segment segment={segment}/>}
                                                    </TimeField.Input>
                                                </TimeField.Group>
                                            </TimeField>
                                        </div>
                                    </div>
                                );
                            })()}

                            {showSelectedSummary && (
                                <span className="mt-1 text-xs text-muted">
                                    Selected:{" "}
                                    {state.value?.start && state.value?.end
                                        ? formatRange({ end: state.value.end, start: state.value.start })
                                        : "No date selected"}
                                </span>
                            )}
                        </DateRangePicker.Popover>
                    </>
                )}
            </DateRangePicker>
        </div>
    );
}

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

import type { TimeValue } from "@heroui/react";
import { DateField, DateRangePicker, Label, RangeCalendar, TimeField, useLocale, } from "@heroui/react";
import { DateFormatter, DateValue, getLocalTimeZone, now, ZonedDateTime } from "@internationalized/date";

export type DateTimeRangeGranularity = "day" | "hour" | "minute" | "second";

type HourCycle = 12 | 24;

export type DateRange = {
    start: DateValue;
    end: DateValue;
};

export interface DateTimeRangeSelectorProps {
    /** Field label shown above the input. */
    label?: string;
    /** Smallest unit shown/editable. Defaults to "second". */
    granularity?: DateTimeRangeGranularity;
    /** 12- or 24-hour clock. Defaults to 24. */
    hourCycle?: HourCycle;
    /** Hide the timezone abbreviation in the segments. */
    hideTimeZone?: boolean;
    /** Force leading zeros on numeric segments. */
    shouldForceLeadingZeros?: boolean;
    /** Controlled value. */
    value?: DateRange | null;
    /** Uncontrolled initial value. */
    defaultValue?: DateRange | null;
    maxValue?: ZonedDateTime | null;
    /** Fires whenever the selected range changes. */
    onChange?: (value: DateRange | null) => void;
    /** Form field names for the hidden inputs (useful in native forms). */
    startName?: string;
    endName?: string;
    className?: string;
    isDisabled?: boolean;
    /** Hide the "Selected: ..." helper line under the calendar. */
    showSelectedSummary?: boolean;
}

const tz = getLocalTimeZone();

export function DateTimeRangeSelector({
                                          label = "Date range",
                                          granularity = "second",
                                          hourCycle = 24,
                                          hideTimeZone = false,
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
                // Remount when granularity flips between date-only and date+time so the
                // segment layout rebuilds cleanly.
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
                                <DateRangePicker.Trigger>
                                    <DateRangePicker.TriggerIndicator/>
                                </DateRangePicker.Trigger>
                            </DateField.Suffix>
                        </DateField.Group>

                        <DateRangePicker.Popover className="flex w-full max-w-63 flex-col gap-3">
                            <RangeCalendar aria-label={label} className="w-full">
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

                            {showTimeField && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Start Time</Label>
                                        <TimeField
                                            aria-label="Start Time"
                                            granularity={timeGranularity}
                                            hideTimeZone={hideTimeZone}
                                            hourCycle={hourCycle}
                                            name="startTime"
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
                            )}

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

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

import {
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { RequestMode, SendParameters } from "@/types/send-message-form";

interface SendParametersSectionProps {
  data: SendParameters;
  onChange: (next: SendParameters) => void;
}

interface FormTextFieldProps {
  label: string;
  value: string;
  type?: "text" | "number";
  onChange: (value: string) => void;
}

function FormTextField({
  label,
  value,
  type = "text",
  onChange,
}: FormTextFieldProps) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      className="w-full"
    >
      <Label>{label}</Label>
      <Input type={type} />
    </TextField>
  );
}

interface ModeSelectFieldProps {
  value: RequestMode;
  onChange: (value: RequestMode) => void;
}

function ModeSelectField({ value, onChange }: ModeSelectFieldProps) {
  return (
    <div className="w-full">
      <Label className="mb-2 block">Mode</Label>

      <Select
        aria-label="Mode"
        selectedKey={value}
        onSelectionChange={(key) => {
          if (key) {
            onChange(key as RequestMode);
          }
        }}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover>
          <ListBox>
            <ListBox.Item id="SOAP">SOAP</ListBox.Item>
            <ListBox.Item id="REST">REST</ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}

export function SendParametersSection({
  data,
  onChange,
}: SendParametersSectionProps) {
  const update = (patch: Partial<SendParameters>) => {
    onChange({
      ...data,
      ...patch,
    });
  };

  return (
    <section className="rounded-lg border border-separator bg-content1 p-5">
      <h2 className="mb-5 text-lg font-semibold">Send parameters</h2>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ModeSelectField
          value={data.mode}
          onChange={(value) => update({ mode: value })}
        />

        <FormTextField
          label="Size (MB)"
          type="number"
          value={String(data.attachmentSizeMB)}
          onChange={(value) =>
            update({ attachmentSizeMB: Number(value) || 0 })
          }
        />

        <FormTextField
          label="Repeat"
          type="number"
          value={String(data.repeatCount)}
          onChange={(value) =>
            update({ repeatCount: Number(value) || 0 })
          }
        />
      </div>
    </section>
  );
}
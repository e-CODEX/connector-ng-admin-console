import {Label, ListBox, Select} from "@heroui/react";
import {PayloadGenerationMode} from "@/types/send-message-form";

interface ExecutionModeSelectFieldProps {
    value: PayloadGenerationMode;
    onChange: (value: PayloadGenerationMode) => void;
}

const requestOptions = [
    {
        id: PayloadGenerationMode.SEQUENTIAL,
        label: "Sequential generation",
    },
    {
        id: PayloadGenerationMode.PREGENERATE,
        label: "Pregenerate with sync delivery",
    },
    {
        id: PayloadGenerationMode.PREGENERATE_WITH_THREADS,
        label: "Pregenerate with async delivery",
    },
];

export function ExecutionModeSelectField({value, onChange}: ExecutionModeSelectFieldProps) {
    return (
        <div className="w-full">
            <Label className="text-sm font-semibold text-default-700">Payload generation</Label>

            <Select
                aria-label="Mode"
                selectedKey={value}
                onSelectionChange={(key) => {
                    if (key) {
                        onChange(key as PayloadGenerationMode);
                    }
                }}
            >
                <Select.Trigger>
                    <Select.Value/>
                    <Select.Indicator/>
                </Select.Trigger>

                <Select.Popover>
                    <ListBox>
                        {requestOptions.map((option) => (
                            <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
                                {option.label}
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>
        </div>
    );
}

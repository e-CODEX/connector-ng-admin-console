import { Label, ListBox, Select } from "@heroui/react";
import { RequestMode } from "@/types/send-message-form";

interface RequestModeSelectFieldProps {
    value: RequestMode;
    onChange: (value: RequestMode) => void;
}

const requestOptions = [
    {
        id: RequestMode.SOAP,
    },
    {
        id: RequestMode.REST,
    },
];

export function RequestModeSelectField({ value, onChange }: RequestModeSelectFieldProps) {
    return (
        <div className="w-full">
            <Label className="text-sm font-semibold text-default-700">Mode</Label>
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
                    <Select.Value/>
                    <Select.Indicator/>
                </Select.Trigger>

                <Select.Popover>
                    <ListBox>
                        {requestOptions.map((option) => (
                            <ListBox.Item key={option.id} id={option.id} textValue={option.id}>
                                {option.id}
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>
        </div>
    );
}

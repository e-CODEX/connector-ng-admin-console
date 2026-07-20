import { Label, ListBox, Select } from "@heroui/react";

interface ReuseFieldSelectFieldProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

const booleanOptions = [
    {
        id: "true",
        label: "Yes",
    },
    {
        id: "false",
        label: "No",
    },
];

export function ReuseFieldSelectField({
                                          value,
                                          onChange,
                                      }: ReuseFieldSelectFieldProps) {

    return (
        <div className="w-full">
            <Label className="text-sm font-semibold text-default-700">
                Reuse files
            </Label>

            <Select
                aria-label="Reuse files"
                selectedKey={String(value)}
                onSelectionChange={(key) => {
                    if (key) {
                        onChange(key === "true");
                    }
                }}
            >
                <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                    <ListBox>
                        {booleanOptions.map((option) => (
                            <ListBox.Item
                                key={option.id}
                                id={option.id}
                                textValue={option.label}
                            >
                                {option.label}
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>
        </div>
    );
}
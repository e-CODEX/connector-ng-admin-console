import { Label, ListBox, Select } from "@heroui/react";
import { FileSourceMode } from "@/types/send-message-form";


type FileSourceSelectProps = {
    value: FileSourceMode;
    onChange: (value: FileSourceMode) => void;
};

const fileSourceOptions = [
    {
        id: FileSourceMode.GENERATED,
        label: "Generate",
    },
    {
        id: FileSourceMode.UPLOADED,
        label: "Upload",
    },
];

export function FileSourceModeSelect({
                                         value,
                                         onChange,
                                     }: FileSourceSelectProps) {
    return (

        <div className="w-full">
            <Label className="text-sm font-semibold text-default-700">File source</Label>
            <Select
                aria-label="Document Source"
                selectedKey={value}
                onSelectionChange={(key) => {
                    if (key) {
                        onChange(key as FileSourceMode);
                    }
                }}
            >
                <Select.Trigger>
                    <Select.Value/>
                    <Select.Indicator/>
                </Select.Trigger>

                <Select.Popover>
                    <ListBox>
                        {fileSourceOptions.map((option) => (
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
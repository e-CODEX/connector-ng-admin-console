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


import {Button, Label, toast} from "@heroui/react";
import {useRef, useState} from "react";


interface FileUploadProps {
    onFilesSelect: (file: File[]) => void;
    text?: string;
    acceptedTypes?: string;
}

export function FileUpload({
                               onFilesSelect,
                               text = "Upload Document",
                               acceptedTypes = ".pdf,.xml",
                           }: FileUploadProps) {

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 0) {
            toast.success(
                `${files.length} file${files.length > 1 ? "s" : ""} selected`
                //    `Selected: ${files.map(f => f.name).join(", ")}`
            );
        }
        setSelectedFiles(files.map(f => f.name));
        onFilesSelect(files);
    };

    return (
        <>
            <div className="w-full">
                <Label className="text-sm font-semibold text-default-700">Upload documents</Label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <Button onPress={() => fileInputRef.current?.click()}>
                    {text}
                </Button>
            </div>
            {selectedFiles.length > 0 && (
                <p className="text-sm text-success">
                    {selectedFiles.length} file(s) selected
                </p>
            )}
        </>
    );

}
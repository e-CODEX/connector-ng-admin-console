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


import {Button} from "@heroui/react";
import {useRef} from "react";


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

    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <div className="flex flex-col gap-4 p-6">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    onChange={
                        (e) => {
                            const files = Array.from(e.target.files || []);
                            onFilesSelect(files);
                        }
                    }
                    className="hidden"
                />

                <Button onPress={() => fileInputRef.current?.click()}>
                    {text}
                </Button>
            </div>
        </>
    );


}
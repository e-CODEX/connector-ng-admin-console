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

import { useCallback } from "react";
import { restApiCall, restApiDownload, type RestApiOptions } from "@/lib/rest";
import { useAppConfig } from "@/hooks/use-app-config";

export function useRestApi() {
    const { apiUrl, bffUrl } = useAppConfig();

    const call = useCallback(
        <T, >(path: string, options?: RestApiOptions) =>
            restApiCall<T>(apiUrl, path, options),
        [apiUrl],
    );

    const callBff = useCallback(
        <T, >(path: string, options?: RestApiOptions) =>
            restApiCall<T>(bffUrl, path, options),
        [bffUrl],
    );

    const download = useCallback(
        (path: string, options?: RestApiOptions) =>
            restApiDownload(apiUrl, path, options),
        [apiUrl],
    );

    return { call, callBff, download };
}

/*
 * Copyright 2026 European Union Agency for the Operational Management of Large-Scale IT Systems
 * in the Area of Freedom, Security and Justice (eu-LISA)
 *
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the
 * European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy at: https://joinup.ec.europa.eu/software/page/eupl
 */

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const MUST_CHANGE_PASSWORD = "mustChangePassword";
export const BACKEND_DOWN_TAG = "down";
export const LAST_KNOWN_USER_KEY = "connector-ui:last-known-user";
export const SESSION_EXPIRED_PATH = "/api/auth/session-expired";
export const LOGIN_EXPIRED_PATH = "/login?expired=1";
export const SESSION_EXPIRED_MARKER = "sessionExpired";
export const SESSION_EXPIRED_MARKER_MAX_AGE_SECONDS = 300;

export type BACKEND_DOWN = "down";

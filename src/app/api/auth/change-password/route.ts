import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAuthService } from "@/services/auth";
import { getAppConfig } from "@/config/config.server";
import { authedRestApiCall } from "@/lib/rest/authed-rest-api";
import { ACCESS_TOKEN_KEY, MUST_CHANGE_PASSWORD, REFRESH_TOKEN_KEY } from "@/utils/constants";

export async function POST(request: Request) {
    const { currentPassword, newPassword } = await request.json();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;
    const { apiUrl } = getAppConfig();
    const authService = createAuthService(apiUrl, authedRestApiCall);

    try {
        await authService.updatePasswordAfterLogin(currentPassword, newPassword, refreshToken);
    } catch(err) {
        return NextResponse.json(
            { message: err instanceof Error ? err.message : "Could not change password." },
            { status: 400 }
        );
    }

    cookieStore.delete(MUST_CHANGE_PASSWORD);
    cookieStore.delete(ACCESS_TOKEN_KEY);
    cookieStore.delete(REFRESH_TOKEN_KEY);

    return NextResponse.json({ ok: true });
}

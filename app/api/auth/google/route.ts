import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET(){
    const state = crypto.randomBytes(16).toString("hex");
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: "code",
        scope: "openid email profile",
        state,
        prompt: "select_account",
    });

    const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    response.cookies.set("google_oauth_state", state, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 300,
    });

    return response;
}
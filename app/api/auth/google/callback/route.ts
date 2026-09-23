import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { hashRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth";
import { setAuthCookies } from "@/lib/session-cookies";

function failRedirect(req: NextRequest, reason: string){
    const response = NextResponse.redirect(new URL(`/signin?error=${reason}`, req.url));
    response.cookies.delete("google_oauth_state");
    return response;
}

export async function GET(req: NextRequest){
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const savedState = req.cookies.get("google_oauth_state")?.value;

    if(!code || !state || !savedState || state !== savedState)
        return failRedirect(req, "oauth_failed");

    let tokenRes;
    try{
        tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                code,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                grant_type: "authorization_code",
            }),
        });
    }
    catch{
        return failRedirect(req, "oauth_failed");
    }

    if(!tokenRes.ok)
        return failRedirect(req, "oauth_failed");

    const tokenData = await tokenRes.json();

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let payload;
    try{
        const ticket = await client.verifyIdToken({
            idToken: tokenData.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    }
    catch{
        return failRedirect(req, "oauth_failed");
    }

    if(!payload?.email || !payload?.sub)
        return failRedirect(req, "oauth_failed");

    const emailVerified = payload.email_verified === true;

    try{
        let user = await prisma.user.findUnique({
            where: {
                googleId: payload.sub,
            },
        });
        if(!user){
            const existingByEmail = await prisma.user.findUnique({
                where: {
                    email: payload.email,
                },
            });
            if(existingByEmail && emailVerified){
                user = await prisma.user.update({
                    where: {
                        id: existingByEmail.id,
                    },
                    data: {
                        googleId: payload.sub,
                    },
                });
            }
            else if(existingByEmail && !emailVerified)
                return failRedirect(req, "email_not_verified");
            else{
                user = await prisma.user.create({
                    data: {
                        email: payload.email,
                        name: payload.name ?? payload.email,
                        googleId: payload.sub,
                        wallet: {
                            create: {
                                balance: 0,
                            },
                        },
                    },
                });
            }
        }

        const accessToken = signAccessToken({userId: user.id});
        const {token: refreshToken, expiresAt} = signRefreshToken({userId: user.id});
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: hashRefreshToken(refreshToken),
                expiresAt,
            },
        });

        const response = NextResponse.redirect(new URL("/dashboard", req.url));
        response.cookies.delete("google_oauth_state");
        return setAuthCookies(response, accessToken, refreshToken);
    }
    catch{
        return failRedirect(req, "oauth_failed");
    }
}
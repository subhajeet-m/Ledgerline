import { NextRequest, NextResponse } from "next/server";
import { signinSchema } from "@/lib/validation/auth.schema";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken, hashRefreshToken } from "@/lib/auth";
import { signinLimiter } from "@/lib/ratelimit";
import { ipAddress } from "@vercel/functions";

const DUMMY_HASH = bcrypt.hashSync("dummypass", 10);

export async function POST(req: NextRequest){
    const body = await req.json();
    const ip = ipAddress(req) ?? "127.0.0.1";

    const validationResult = signinSchema.safeParse(body);
    if(!validationResult.success)
        return NextResponse.json({error: z.flattenError(validationResult.error)}, {status: 400});

    const user = await prisma.user.findUnique({where: {email: validationResult.data.email}});

    const {success} = await signinLimiter.limit(ip);
    if(!success)
        return NextResponse.json({error: "Too many sign-in attempts. Please try again after some time"}, {status: 429});
    
    const userPass = user? user.password : DUMMY_HASH;
    const validUser = await bcrypt.compare(validationResult.data.password, userPass);
    if(!validUser || !user)
        return NextResponse.json({error: "Invalid email or password"}, {status: 401});

    const accessToken = signAccessToken({userId: user.id});
    const {token, expiresAt} = signRefreshToken({userId: user.id});
    const refreshTokenHash = hashRefreshToken(token);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            tokenHash: refreshTokenHash,
            expiresAt: expiresAt
        }
    });

    const response = NextResponse.json({user: {id: user.id, email: user.email}}, {status: 200});
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 15*60
    });
    response.cookies.set("refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7*24*60*60
    });

    return response;
}
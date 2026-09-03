import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, hashRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest){
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if(!refreshToken)
        return NextResponse.json({error: "Please sign in to your account to access the content"}, {status: 401});
    try{
        verifyRefreshToken(refreshToken);
    }catch{
        return NextResponse.json({error: "Invalid credentials"}, {status: 401});
    }

    const hashedToken = hashRefreshToken(refreshToken);
    const findToken = await prisma.refreshToken.findUnique({where: {tokenHash: hashedToken}});
    if(!findToken || findToken.revokedAt!=null || findToken.expiresAt.getTime()<=Date.now()){
        const response = NextResponse.json({error: "User not found"}, {status: 401});
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    }
    await prisma.refreshToken.update({
        where: {
            tokenHash: hashedToken,
        },
        data: {
            revokedAt: new Date()
        }
    });
    const newAccessToken = signAccessToken({userId: findToken.userId});
    const {token, expiresAt} = signRefreshToken({userId: findToken.userId});
    const newHashedRefreshToken = hashRefreshToken(token);

    await prisma.refreshToken.create({
        data: {
            userId: findToken.userId,
            tokenHash: newHashedRefreshToken,
            expiresAt: expiresAt
        }
    });

    const response = NextResponse.json({success: true}, {status: 200});
    response.cookies.set("accessToken", newAccessToken, {
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
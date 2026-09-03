import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest){
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if(!refreshToken){
        const response = NextResponse.json({success: "Already signed out"}, {status: 200});
        response.cookies.delete("accessToken");
        return response;
    }
    const hashedToken = hashRefreshToken(refreshToken);
    const dbTokenCheck = await prisma.refreshToken.findUnique({where: {tokenHash: hashedToken}});
    if(!dbTokenCheck){
        const response = NextResponse.json({success: "Logged out successfully"}, {status: 200});
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");

        return response;
    }
    if(!dbTokenCheck.revokedAt){
        await prisma.refreshToken.update({
            where: {
                tokenHash: hashedToken,
            },
            data: {
                revokedAt: new Date(),
            }
        });
    }
    const response = NextResponse.json({success: "Logged out successfully"}, {status: 200});
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
}
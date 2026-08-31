import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validation/auth.schema";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken, hashRefreshToken } from "@/lib/auth";
import { Prisma } from "@/app/generated/prisma/client";

export async function POST(req: NextRequest){
    const body = await req.json();
    
    const validationResult = signupSchema.safeParse(body);
    if(!validationResult.success)
        return NextResponse.json({error: z.flattenError(validationResult.error)}, {status: 400});

    const data = validationResult.data;

    let hashedPass;
    try{
        hashedPass = await bcrypt.hash(data.password, 10);
    }
    catch(err){
        return NextResponse.json({error: err instanceof Error? err.message: "Hashing failed"}, {status: 400});
    }

    let user;
    try{
        user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPass,
                name: data.name,
                wallet: {
                    create: {
                        balance: 0,
                    }
                }
            }
        });
    }
    catch(err){
        if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002")
            return NextResponse.json({error: "Email already in use"}, {status: 409});
        throw err;
    }

    const accessToken = signAccessToken({userId: user.id});
    const {token, expiresAt} = signRefreshToken({userId: user.id});

    const tokenHash = hashRefreshToken(token);
    await prisma.refreshToken.create({
        data:{
            userId: user.id,
            tokenHash: tokenHash,
            expiresAt: expiresAt
        }
    })

    const response = NextResponse.json({user: {id: user.id, email: user.email}}, {status: 201});
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60*15
    });
    response.cookies.set("refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60*60*24*7
    });

    return response;
}
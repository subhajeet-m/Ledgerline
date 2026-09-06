import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getSession();
    if(!session)
        return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const wallet = await prisma.wallet.findUnique({where: {userId: session.userId}});
    if(!wallet)
        return NextResponse.json({error: "Wallet doesn't exist for user"}, {status: 500});

    return NextResponse.json({
        balance: wallet.balance,
    });
}
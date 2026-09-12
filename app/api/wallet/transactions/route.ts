import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const session = await getSession();
    if(!session)
        return NextResponse.json({error: "Unauthorized session"}, {status: 401});

    const wallet = await prisma.wallet.findUnique({
        where: {
            userId: session.userId,
        },
    });
    if(!wallet)
        return NextResponse.json({error: "Wallet doesn't exist for user"}, {status: 500});

    const cursorParams = req.nextUrl.searchParams.get("cursor");
    const cursor = cursorParams? Number(cursorParams):undefined;
    if(cursor !== undefined && Number.isNaN(cursor))
        return NextResponse.json({error: "Invalid cursor"}, {status: 400});

    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [{senderWalletId:wallet.id}, {receiverWalletId: wallet.id}],
            ...(cursor? {id: {lt: cursor}}: {})
        },
        orderBy: {id: "desc"},
        take: 15,
        include: {
            senderWallet: { include: { user: { select: { name: true } } } },
            receiverWallet: { include: { user: { select: { name: true } } } },
        },
    });

    const serialized = transactions.map((tx) => ({
        id: tx.id,
        senderWalletId: tx.senderWalletId,
        receiverWalletId: tx.receiverWalletId,
        amount: tx.amount.toString(),
        createdAt: tx.createdAt.toISOString(),
        senderName: tx.senderWallet.user.name,
        receiverName: tx.receiverWallet.user.name,
    }));

    const nextCursor = transactions.length === 15? transactions[transactions.length-1].id : null;

    return NextResponse.json({transactions: serialized, nextCursor});
}
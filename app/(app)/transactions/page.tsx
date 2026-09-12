import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import TransactionList from "@/components/TransactionList";

export default async function TransactionPage(){
    const session = await getSession();
    if(!session)
        throw new Error("Unauthorized access");

    const wallet = await prisma.wallet.findUnique({
        where: {
            userId: session.userId,
        },
    });
    if(!wallet)
        notFound();

    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [{senderWalletId: wallet.id}, {receiverWalletId: wallet.id}]
        },
        orderBy: {id: "desc"},
        take: 15,
        include: {
            senderWallet: { include: { user: { select: { name: true } } } },
            receiverWallet: { include: { user: { select: { name: true } } } },
        },
    });
    const serialized = transactions.map((tx)=>({
        id: tx.id,
        senderWalletId: tx.senderWalletId,
        receiverWalletId: tx.receiverWalletId,
        amount: tx.amount.toString(),
        createdAt: tx.createdAt.toISOString(),
        senderName: tx.senderWallet.user.name,
        receiverName: tx.receiverWallet.user.name,
    }));
    const nextCursor = transactions.length === 15? transactions[transactions.length-1].id: null;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-black">Transactions</h1>
            <TransactionList
            initialTransfer = {serialized}
            initialNextCursor = {nextCursor}
            walletId = {wallet.id} />
        </div>
    )
}
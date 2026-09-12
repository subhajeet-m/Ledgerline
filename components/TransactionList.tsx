'use client';

import { useTransactions } from "@/hooks/useTransactions";
import { formatINR } from "@/lib/format";

type Transactions = {
    id: number;
    senderWalletId: number;
    receiverWalletId: number;
    amount: string;
    createdAt: string;
    senderName: string;
    receiverName: string;
};

type Props = {
    initialTransfer: Transactions[];
    initialNextCursor: number | null;
    walletId: number;
}

export default function TransactionList({initialTransfer, initialNextCursor, walletId}: Props){
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useTransactions(initialTransfer, initialNextCursor);

    const allTransactions = data?.pages.flatMap((page)=>page.transactions);

    if(allTransactions?.length === 0)
        return (
            <div className="rounded-md bg-white p-6 shadow-sm text-center text-sm text-gray-400">
                No transactions yet
            </div>
        )

    return (
        <div className="space-y-3">
            {allTransactions.map((tx)=>{
                const isOutGoing = tx.senderWalletId === walletId;
                const otherParty = isOutGoing? tx.receiverName : tx.senderName;
                const date = new Date(tx.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });

                return (
                    <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-md bg-white p-4 shadow-sm"
                    >
                        <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                                {isOutGoing? "Sent to ":"Received from "}
                                <span className="font-semibold text-black">{otherParty}</span>
                            </p>
                            <p className="text-xs text-gray-400">{date}</p>
                        </div>
                        <p className={`text-lg font-bold ${isOutGoing? "text-red-600":"text-green-600"}`}>
                            {isOutGoing? "-":"+"}{formatINR(tx.amount)}
                        </p>
                    </div>
                )
            })}
            {hasNextPage && (
                <button
                onClick={()=>fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full rounded-md bg-gray-900 p-2 text-white hover:bg-black disabled:opacity-60"
                >
                    {isFetchingNextPage? "Loading...":"Load more"}
                </button>
            )}
        </div>
    )
}

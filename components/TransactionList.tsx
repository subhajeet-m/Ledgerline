'use client';

import { useTransactions } from "@/hooks/useTransactions";
import { formatINR } from "@/lib/format";
import { Transactions } from "@/types";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

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

    const groups: { label: string; items: Transactions[] }[] = [];
    for (const tx of allTransactions ?? []) {
        const label = new Date(tx.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const last = groups[groups.length - 1];
        if (last && last.label === label) {
            last.items.push(tx);
        } else {
            groups.push({ label, items: [tx] });
        }
    }

    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <div key={group.label}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{group.label}</p>
                    <div className="rounded-md bg-white shadow-sm divide-y divide-gray-100">
                        {group.items.map((tx) => {
                            const isOutGoing = tx.senderWalletId === walletId;
                            const otherParty = isOutGoing? tx.receiverName : tx.senderName;
                            const time = new Date(tx.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                key={tx.id}
                                className="flex items-center justify-between p-4"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            {isOutGoing? "Sent to ":"Received from "}
                                            <span className="font-semibold text-black">{otherParty}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">{time}</p>
                                    </div>
                                    <p className={`flex items-center gap-1 text-lg font-bold ${isOutGoing? "text-red-600":"text-green-600"}`}>
                                        {isOutGoing? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                        {isOutGoing? "-":"+"}{formatINR(tx.amount)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
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

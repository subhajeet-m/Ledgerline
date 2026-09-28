'use client';

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { formatINR } from "@/lib/format";
import { Transactions } from "@/types";
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Props = {
    initialTransfer: Transactions[];
    initialNextCursor: number | null;
    walletId: number;
}

function getTxDetails(tx: Transactions, walletId: number) {
    const isOutGoing = tx.senderWalletId === walletId;
    const otherParty = isOutGoing ? tx.receiverName : tx.senderName;
    const date = new Date(tx.createdAt);
    return {
        isOutGoing,
        otherParty,
        time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        fullDate: date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
    };
}

export default function TransactionList({initialTransfer, initialNextCursor, walletId}: Props){
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useTransactions(initialTransfer, initialNextCursor);

    const [selected, setSelected] = useState<Transactions | null>(null);

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

    const selectedDetails = selected ? getTxDetails(selected, walletId) : null;

    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <div key={group.label}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{group.label}</p>
                    <div className="rounded-md bg-white shadow-sm divide-y divide-gray-100">
                        {group.items.map((tx) => {
                            const { isOutGoing, otherParty, time } = getTxDetails(tx, walletId);

                            return (
                                <div
                                key={tx.id}
                                onClick={()=>setSelected(tx)}
                                className="flex items-center justify-between gap-3 p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <p className="text-sm text-gray-600 truncate">
                                            {isOutGoing? "Sent to ":"Received from "}
                                            <span className="font-semibold text-black">{otherParty}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">{time}</p>
                                    </div>
                                    <p className={`flex items-center gap-1 shrink-0 text-base sm:text-lg font-bold ${isOutGoing? "text-red-600":"text-green-600"}`}>
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
                className="flex items-center justify-center gap-2 w-full rounded-md bg-gray-900 p-2 text-white hover:bg-black transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
                >
                    {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isFetchingNextPage? "Loading...":"Load more"}
                </button>
            )}

            <Dialog open={selected !== null} onOpenChange={(open)=>{ if(!open) setSelected(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transaction details</DialogTitle>
                        <DialogDescription>
                            {selected && selectedDetails && (
                                <span className="block space-y-2 text-left mt-2">
                                    <span className="block">
                                        {selectedDetails.isOutGoing ? "Sent to " : "Received from "}
                                        <strong className="text-black">{selectedDetails.otherParty}</strong>
                                    </span>
                                    <span className={`block text-lg font-bold ${selectedDetails.isOutGoing ? "text-red-600" : "text-green-600"}`}>
                                        {selectedDetails.isOutGoing ? "-" : "+"}{formatINR(selected.amount)}
                                    </span>
                                    <span className="block text-xs text-gray-400">{selectedDetails.fullDate}</span>
                                    <span className="block text-xs text-gray-400">Transaction ID: {selected.id}</span>
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

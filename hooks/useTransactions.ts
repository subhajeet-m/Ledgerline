import { useInfiniteQuery } from "@tanstack/react-query";

type Transactions = {
    id: number;
    senderWalletId: number;
    receiverWalletId: number;
    amount: string;
    createdAt: string;
    senderName: string;
    receiverName: string;
};

export function useTransactions(initialTransfer: Transactions[], initialNextCursor: number | null){
    return useInfiniteQuery({
        queryKey: ["transactions"],
        queryFn: async ({pageParam}) =>{
            const url = pageParam? `/api/wallet/transactions?cursor=${pageParam}`:"/api/wallet/transactions";
            const res = await fetch(url);
            if(!res.ok)
                throw new Error("Failed to load transactions")
            return res.json();
        },
        initialPageParam: null,
        getNextPageParam: (lastPage)=> lastPage.nextCursor,
        initialData: {
            pages: [{transactions: initialTransfer, nextCursor: initialNextCursor}],
            pageParams: [null]
        },
    });
}
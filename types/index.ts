export type ApiErrorResponse = {
    error: string;
    fieldErrors?: Record<string, string[]>;
}

export type Transactions = {
    id: number;
    senderWalletId: number;
    receiverWalletId: number;
    amount: string;
    createdAt: string;
    senderName: string;
    receiverName: string;
};
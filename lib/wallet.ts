import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "./prisma";

export async function executeTransfer(senderWalletId: number, receiverWalletId: number, amount: Decimal){
    if(senderWalletId === receiverWalletId)
        throw new Error("Sending to yourself is not allowed");
    if(amount.lte(0))
        throw new Error("Transfer amount needs to be more than 0");

    const [fromId, toId] = [senderWalletId, receiverWalletId].sort((a, b)=>a-b);

    return prisma.$transaction(async(tx)=>{
        await tx.$queryRaw`SELECT id FROM "Wallet" WHERE id=${fromId} FOR UPDATE`;
        await tx.$queryRaw`SELECT id FROM "Wallet" WHERE id=${toId} FOR UPDATE`;

        const sender = await tx.wallet.findUniqueOrThrow({where: {id: senderWalletId}});

        if(sender.balance.lt(amount))
            throw new Error("Insufficient balance");

        await tx.wallet.update({
            where: {id: senderWalletId},
            data: {
                balance: {
                    decrement: amount
                }
            }
        });
        await tx.wallet.update({
            where: {id: receiverWalletId},
            data: {
                balance: {
                    increment: amount
                }
            }
        });

        await tx.transaction.create({
            data: {
                senderWalletId: senderWalletId,
                receiverWalletId: receiverWalletId,
                amount: amount
            }
        });

        const newBalance = await tx.wallet.findUniqueOrThrow({where: {id: senderWalletId}});

        return newBalance.balance;
    });
}
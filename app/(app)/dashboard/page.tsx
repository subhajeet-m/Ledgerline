import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session"
import { Decimal } from "@prisma/client/runtime/client";
import { notFound } from "next/navigation";

export default async function DashboardPage(){
    const session = await getSession();
    if(!session)
        throw new Error("Unauthorized");

    const wallet = await prisma.wallet.findUnique({
        where: {
            userId: session.userId
        },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        }
    });

    if(!wallet){
        notFound();
    }
    const maskedWalletId = `...${String(wallet.id).padStart(5, "0")}`;

    function formatINR(amount: Decimal | number | string){
        const accBalance = amount instanceof Decimal? amount.toNumber(): typeof amount === 'string'? parseFloat(amount):amount;
        if(isNaN(accBalance))
            return '₹0.00';

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(accBalance);
    }
    return (
        <div className="rounded-md bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
            <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-400">{wallet.user.name}</p>
                <p className="text-sm text-gray-400">{maskedWalletId}</p>
                <p className="text-3xl font-bold text-black">{formatINR(wallet.balance)}</p>
            </div>
        </div>
    )
}
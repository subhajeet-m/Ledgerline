import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session"
import { notFound } from "next/navigation";
import { formatINR } from "@/lib/format";
import Link from "next/link";
import { Wallet, ArrowRightLeft, Receipt } from "lucide-react";

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

    return (
        <div className="rounded-md bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
            <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-400">{wallet.user.name}</p>
                <span className="inline-block text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{maskedWalletId}</span>
                <p className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-1 pt-2">
                    <Wallet className="w-3.5 h-3.5" />
                    Available Balance
                </p>
                <p className="text-3xl font-bold text-black">{formatINR(wallet.balance)}</p>
            </div>
            <div className="mt-6 flex gap-3">
                <Link href="/transfer" className="flex items-center gap-1.5 text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-md px-4 py-2 transition-colors">
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer
                </Link>
                <Link href="/transactions" className="flex items-center gap-1.5 text-sm text-black border-2 border-gray-200 hover:border-gray-400 rounded-md px-4 py-2">
                    <Receipt className="w-4 h-4" />
                    Transactions
                </Link>
            </div>
        </div>
    )
}
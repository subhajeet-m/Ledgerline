import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session"
import { notFound } from "next/navigation";
import { formatINR } from "@/lib/format";

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
                <p className="text-sm text-gray-400">{maskedWalletId}</p>
                <p className="text-3xl font-bold text-black">{formatINR(wallet.balance)}</p>
            </div>
        </div>
    )
}
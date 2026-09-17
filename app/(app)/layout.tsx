import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import { Metadata } from "next";
import QueryProvider from "@/components/QueryProvider";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = {
    title: "Ledgerline",
    description: "Your Ledgerline wallet — balance, transfers, and transaction history.",
};

export default async function dashboardLayout({children}:{children:ReactNode}){
    const session = await getSession();
    if(!session)
        redirect("/signin");

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 bg-white px-6 py-4 shadow-sm">
                <span className="text-lg font-bold text-black">Ledgerline</span>
                <div className="flex items-center gap-4">
                    <Link href="/transfer" className="text-sm text-gray-600 hover:underline">Transfer</Link>
                    <Link href="/transactions" className="text-sm text-gray-600 hover:underline">Transactions</Link>
                    <SignOutButton></SignOutButton>
                </div>
            </nav>
            <QueryProvider><main className="mx-auto max-w-4xl p-6">{children}</main></QueryProvider>
        </div>
    )
}
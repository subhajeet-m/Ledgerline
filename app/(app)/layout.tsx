import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function dashboardLayout({children}:{children:ReactNode}){
    const session = await getSession();
    if(!session)
        redirect("/signin");

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
                <span className="text-lg font-bold text-black">Ledgerline</span>
            </nav>
            <main className="mx-auto max-w-4xl p-6">{children}</main>
        </div>
    )
}
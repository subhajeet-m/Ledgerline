import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In / Sign Up — Ledgerline",
    description: "Sign in or create an account on Ledgerline, a concurrency-safe digital wallet.",
};

export default async function AuthLayout({children}:{children:ReactNode}){
    const session = await getSession();
    if(session)
        redirect('/dashboard');

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-300">
            <div className="w-full max-w-sm rounded-md bg-white text-center p-5 shadow-md space-y-3.5">
                {children}
            </div>
        </div>
    )
}
'use client';

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton(){
    const router = useRouter();
    const handSignOut = async ()=>{
        await fetch('/api/auth/signout', {
            method: "POST",
            credentials: "include",
        });
        router.push('/signin');
    };

    return (
        <button onClick={handSignOut} className="flex items-center gap-1.5 text-white bg-gray-900 hover:bg-black rounded-md px-3 py-2 text-sm cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
        </button>
    )
}
'use client';

import { useRouter } from "next/navigation";

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
        <button onClick={handSignOut} className="text-white bg-gray-900 hover:bg-black rounded-md px-3 py-2 text-sm cursor-pointer">
            Sign Out
        </button>
    )
}
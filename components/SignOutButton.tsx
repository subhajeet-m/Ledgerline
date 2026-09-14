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
        <button onClick={handSignOut} className="text-white bg-gray-900 hover:bg-black rounded-md p-2 w-full cursor-pointer">
            Sign Out
        </button>
    )
}
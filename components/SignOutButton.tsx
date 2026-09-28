'use client';

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        <AlertDialog>
            <AlertDialogTrigger
                className="flex items-center gap-1.5 text-white bg-gray-900 hover:bg-black rounded-md px-3 py-2 text-sm cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You&apos;ll need to sign in again to access your wallet.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handSignOut}>Sign Out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, Receipt } from "lucide-react";

export default function AppNav() {
    const pathname = usePathname();
    const linkClass = (href: string) =>
        `flex items-center gap-1.5 text-sm hover:underline ${pathname === href ? "text-indigo-600 font-medium" : "text-gray-600"}`;

    return (
        <div className="flex items-center gap-4">
            <Link href="/transfer" className={linkClass("/transfer")}>
                <ArrowRightLeft className="w-4 h-4" />
                Transfer
            </Link>
            <Link href="/transactions" className={linkClass("/transactions")}>
                <Receipt className="w-4 h-4" />
                Transactions
            </Link>
        </div>
    );
}

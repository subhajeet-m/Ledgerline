import { ReactNode } from "react";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="max-w-2xl mx-auto px-6 py-12 space-y-4 text-gray-700">
            <h1 className="text-2xl font-bold text-black">{title}</h1>
            {children}
        </div>
    );
}

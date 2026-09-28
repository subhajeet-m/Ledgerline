import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";

const features = [
    {
        title: "Concurrency-safe transfers",
        body: "Row-level locking with consistent lock ordering prevents deadlocks and lost updates under concurrent load.",
    },
    {
        title: "Idempotent by design",
        body: "Redis-backed idempotency keys make retries and double-clicks safe — never double-executed.",
    },
    {
        title: "Secure auth",
        body: "Short-lived JWTs with rotating, revocable refresh tokens in httpOnly cookies.",
    },
];

export default async function Home(){
    const session = await getSession();
    if(session)
        redirect("/dashboard");

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 bg-white px-6 py-4 border-b border-gray-100">
                <span className="text-lg font-bold text-black">Ledgerline</span>
                <div className="flex items-center gap-4">
                    <Link href="/signin" className="text-sm text-gray-600 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1 rounded-sm">Sign In</Link>
                    <Link href="/signup" className="text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-md px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1">Sign Up</Link>
                </div>
            </nav>

            <section className="flex flex-col items-center text-center px-6 py-20 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-black">A digital wallet built for correctness under concurrency</h1>
                <p className="mt-4 text-gray-600 text-lg">
                    Concurrency-safe transfers, idempotent APIs, and JWT authentication — a full-stack demo of production-style payments engineering.
                </p>
                <div className="mt-8 flex gap-4">
                    <Link href="/signup" className="text-white bg-indigo-500 hover:bg-indigo-600 rounded-md px-6 py-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1">Get Started</Link>
                    <Link href="/signin" className="text-black border-2 border-gray-200 hover:border-gray-400 rounded-md px-6 py-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1">Sign In</Link>
                </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 py-16 max-w-4xl mx-auto w-full">
                {features.map((f) => (
                    <div key={f.title} className="border-2 border-gray-100 rounded-md p-5">
                        <h3 className="font-semibold text-black">{f.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{f.body}</p>
                    </div>
                ))}
            </section>

            <footer className="text-center text-sm text-gray-500 py-8 border-t mt-auto">
                <p>Ledgerline — a portfolio project, not a real financial service.</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                    <a href="mailto:therealsm954@gmail.com" className="inline-flex items-center gap-1 hover:underline">
                        <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                    {" · "}
                    <a href="https://github.com/subhajeet-m" className="inline-flex items-center gap-1 hover:underline">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.03-1.61-4.03-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.77.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12Z"/>
                        </svg>
                        GitHub
                    </a>
                    {" · "}
                    <a href="https://linkedin.com/in/subhajeet-mukherjee-45492a200" className="inline-flex items-center gap-1 hover:underline">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/>
                        </svg>
                        LinkedIn
                    </a>
                    {" · "}
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    {" · "}
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                </p>
            </footer>
        </div>
    );
}

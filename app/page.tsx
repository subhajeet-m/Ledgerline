import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

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
                    <Link href="/signin" className="text-sm text-gray-600 hover:underline">Sign In</Link>
                    <Link href="/signup" className="text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-md px-4 py-2 transition-colors">Sign Up</Link>
                </div>
            </nav>

            <section className="flex flex-col items-center text-center px-6 py-20 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-black">A digital wallet built for correctness under concurrency</h1>
                <p className="mt-4 text-gray-600 text-lg">
                    Concurrency-safe transfers, idempotent APIs, and JWT authentication — a full-stack demo of production-style payments engineering.
                </p>
                <div className="mt-8 flex gap-4">
                    <Link href="/signup" className="text-white bg-indigo-500 hover:bg-indigo-600 rounded-md px-6 py-3 font-medium transition-colors">Get Started</Link>
                    <Link href="/signin" className="text-black border-2 border-gray-200 hover:border-gray-400 rounded-md px-6 py-3 font-medium">Sign In</Link>
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
                <p className="mt-1">
                    <a href="mailto:therealsm954@gmail.com" className="hover:underline">Email</a>
                    {" · "}
                    <a href="https://github.com/subhajeet-m" className="hover:underline">GitHub</a>
                    {" · "}
                    <a href="https://linkedin.com/in/subhajeet-mukherjee-45492a200" className="hover:underline">LinkedIn</a>
                    {" · "}
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    {" · "}
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                </p>
            </footer>
        </div>
    );
}

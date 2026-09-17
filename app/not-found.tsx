import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
            <h1 className="text-4xl font-bold text-black">404</h1>
            <p className="mt-2 text-gray-600">This page doesn&apos;t exist.</p>
            <Link href="/" className="mt-6 text-white bg-gray-900 hover:bg-black rounded-md px-6 py-3 font-medium">
                Back to Ledgerline
            </Link>
        </div>
    );
}

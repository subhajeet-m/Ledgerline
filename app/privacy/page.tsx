import LegalPage from "@/components/LegalPage";

export const metadata = {
    title: "Privacy Policy — Ledgerline",
    description: "What Ledgerline, a portfolio demonstration project, actually collects and why.",
};

export default function PrivacyPage(){
    return (
        <LegalPage title="Privacy Policy">
            <p>
                Ledgerline is a personal portfolio and demonstration project. This page describes
                exactly what data the application collects and how it is used — nothing more.
            </p>

            <h2 className="text-lg font-semibold text-black">What we collect</h2>
            <p>
                At signup: your name, email address, and password. Your password is hashed
                with bcrypt before it is stored — the plaintext password is never saved or
                logged. When you use the transfer feature, we store the sender and receiver
                wallet IDs, the transfer amount, and a timestamp, as a permanent transaction
                record. No other personal information is collected.
            </p>

            <h2 className="text-lg font-semibold text-black">Cookies</h2>
            <p>
                Ledgerline sets exactly two cookies, both strictly necessary for keeping you
                signed in: an access token and a refresh token, each marked httpOnly so they
                cannot be read by JavaScript. Neither is used for tracking or analytics, and
                no analytics or advertising cookies are set anywhere on this site.
            </p>

            <h2 className="text-lg font-semibold text-black">Infrastructure providers</h2>
            <p>
                Ledgerline runs on Vercel (hosting), Neon (database), and Upstash (Redis).
                These providers process data only as necessary to run the application. Your
                data is not sold, shared, or used for advertising by Ledgerline or any of these
                providers.
            </p>

            <h2 className="text-lg font-semibold text-black">Analytics</h2>
            <p>
                Ledgerline does not currently use any analytics or third-party tracking
                scripts. If this changes in the future, this page will be updated to reflect
                it before any such tool is added.
            </p>

            <h2 className="text-lg font-semibold text-black">Contact</h2>
            <p>
                Questions about this policy can be sent to{" "}
                <a href="mailto:therealsm954@gmail.com" className="underline">therealsm954@gmail.com</a>.
            </p>
        </LegalPage>
    );
}

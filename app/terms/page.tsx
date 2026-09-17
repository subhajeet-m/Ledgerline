import LegalPage from "@/components/LegalPage";

export const metadata = {
    title: "Terms & Conditions — Ledgerline",
    description: "Terms and conditions for Ledgerline, a portfolio demonstration project.",
};

export default function TermsPage(){
    return (
        <LegalPage title="Terms & Conditions">
            <p>
                Ledgerline is a personal portfolio and demonstration project built to showcase
                full-stack software engineering. It is <strong>not</strong> a licensed financial
                institution, bank, payment processor, or regulated financial service of any kind.
            </p>

            <h2 className="text-lg font-semibold text-black">No real money</h2>
            <p>
                No real money is ever moved, held, or transferred through this application.
                Every balance and transaction exists solely within Ledgerline&apos;s own
                database, for demonstration purposes only.
            </p>

            <h2 className="text-lg font-semibold text-black">Service provided &quot;as-is&quot;</h2>
            <p>
                Ledgerline is provided as-is, without any warranty of availability, reliability,
                or fitness for a particular purpose. There is no service-level agreement, and
                the application, or any account on it, may be modified, suspended, or taken
                offline at any time without notice.
            </p>

            <h2 className="text-lg font-semibold text-black">Accounts</h2>
            <p>
                You are responsible for the information you provide when creating an account.
                Accounts may be removed at any time, for any reason, without prior notice.
            </p>

            <h2 className="text-lg font-semibold text-black">Contact</h2>
            <p>
                Questions about these terms can be sent to{" "}
                <a href="mailto:therealsm954@gmail.com" className="underline">therealsm954@gmail.com</a>.
            </p>
        </LegalPage>
    );
}

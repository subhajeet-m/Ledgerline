import { Loader2 } from "lucide-react";

export default function FormButton({ buttonText, disabled }: { buttonText: string; disabled?: boolean }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="flex items-center justify-center gap-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-md p-2 w-full cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-1"
        >
            {disabled && <Loader2 className="w-4 h-4 animate-spin" />}
            {buttonText}
        </button>
    );
}

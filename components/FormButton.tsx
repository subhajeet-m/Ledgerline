export default function FormButton({ buttonText, disabled }: { buttonText: string; disabled?: boolean }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="text-white bg-indigo-500 hover:bg-indigo-600 rounded-md p-2 w-full cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500"
        >
            {buttonText}
        </button>
    );
}

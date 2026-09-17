export default function FormButton({ buttonText, disabled }: { buttonText: string; disabled?: boolean }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="text-white bg-gray-900 hover:bg-black rounded-md p-2 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
        >
            {buttonText}
        </button>
    );
}

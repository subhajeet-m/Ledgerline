export default function Button({ buttonText }: { buttonText: string }) {
    return (
        <button
            type="submit"
            className="text-white bg-gray-900 hover:bg-black rounded-md p-2 w-full cursor-pointer"
        >
            {buttonText}
        </button>
    );
}

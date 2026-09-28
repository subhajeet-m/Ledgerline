export default function PageLoading() {
    return (
        <div className="rounded-md bg-white p-6 shadow-sm animate-pulse space-y-3">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-32 bg-gray-100 rounded"></div>
            <div className="h-8 w-40 bg-gray-200 rounded mt-2"></div>
        </div>
    );
}

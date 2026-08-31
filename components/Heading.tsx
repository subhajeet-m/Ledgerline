export default function Heading({ title }: { title: string }) {
    return (
        <div className="text-3xl font-bold text-black pt-4">
            {title}
        </div>
    );
}

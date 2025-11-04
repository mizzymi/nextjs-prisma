export default function CardHeader({ name, id }: { name: string; id: string }) {
    return (
        <>
            <h1 className="text-3xl font-semibold">{name}</h1>
            <div className="mt-1 text-sm opacity-70">{id}</div>
        </>
    );
}

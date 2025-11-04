export default function AttacksList({
    attacks,
}: {
    attacks?: Array<{ name?: string; text?: string; effect?: string; damage?: string | number; cost?: string[] }>;
}) {
    if (!attacks?.length) return null;

    return (
        <div className="mt-6">
            <h2 className="text-lg font-medium">Ataques</h2>
            <ul className="mt-2 space-y-3 text-sm">
                {attacks.map((a, i) => (
                    <li key={i} className="rounded border p-2">
                        <div className="font-medium">
                            {a.name}
                            {a.damage ? <span className="opacity-70"> — {a.damage}</span> : null}
                        </div>
                        {a.cost?.length ? <div className="opacity-70">Coste: {a.cost.join(", ")}</div> : null}
                        {(a.text || a.effect) && <div className="mt-1">{a.text ?? a.effect}</div>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

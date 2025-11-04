export default function AbilitiesList({
    abilities,
}: {
    abilities?: Array<{ name?: string; text?: string; effect?: string; type?: string }>;
}) {
    if (!abilities?.length) return null;

    return (
        <div className="mt-6">
            <h2 className="text-lg font-medium">Habilidades</h2>
            <ul className="mt-2 space-y-2 text-sm">
                {abilities.map((a, i) => (
                    <li key={i}>
                        <strong>{a.type ? `${a.type}: ` : ""}{a.name}</strong>
                        {": "}
                        <span>{a.text ?? a.effect ?? "—"}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

import { fmtEUR } from "@/lib/server-only/cards";

export default function DeckHeader({
    title,
    createdAt,
    totalCards,
    totalLow,
    totalTrend,
}: {
    title: string;
    createdAt: Date;
    totalCards: number;
    totalLow: number;
    totalTrend: number;
}) {
    return (
        <header className="mt-3 mb-4">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-black/60">
                Creado: {new Date(createdAt).toLocaleDateString("es-ES")} · {totalCards} cartas
            </p>
            <div className="flex flex-col sm:flex-row sm:gap-4">
                <p className="text-sm text-black/80 mt-1">
                    Total LOW: <strong>{fmtEUR(totalLow)}</strong>
                </p>
                <p className="text-sm text-black/80 mt-1">
                    Total TREND: <strong>{fmtEUR(totalTrend)}</strong>
                </p>
            </div>
        </header>
    );
}

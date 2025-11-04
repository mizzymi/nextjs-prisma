import { fmtEUR } from "@/lib/utils";

export default function CardmarketSection({
    trend,
    low,
    avg7,
    avg30,
}: {
    trend?: number;
    low?: number;
    avg7?: number;
    avg30?: number;
}) {
    return (
        <div className="mt-6 text-sm">
            <h2 className="text-lg font-medium">Cardmarket</h2>
            {typeof trend === "number" || typeof low === "number" ? (
                <div className="mt-2 space-y-1">
                    <div>
                        Trend: {fmtEUR(trend)} · Low: {fmtEUR(low)}
                    </div>
                    {typeof avg7 === "number" || typeof avg30 === "number" ? (
                        <div className="opacity-80">
                            Media 7d: {fmtEUR(avg7)} · Media 30d: {fmtEUR(avg30)}
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="opacity-70">No Cardmarket price</div>
            )}
        </div>
    );
}

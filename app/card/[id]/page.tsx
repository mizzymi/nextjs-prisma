import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type CardDetail = {
    id: string;
    name: string;
    images?: { small?: string; large?: string };
    image?: string;
    set?: { id?: string; name?: string };
    illustrator?: string;
    rarity?: string;
    category?: string;
    hp?: number | string;
    stage?: string;
    types?: string[];
    description?: string;
    effect?: string;
    attacks?: Array<{ name?: string; text?: string; effect?: string; damage?: string | number; cost?: string[] }>;
    abilities?: Array<{ name?: string; text?: string; effect?: string; type?: string }>;
    weaknesses?: Array<{ type?: string; value?: string }>;
    resistances?: Array<{ type?: string; value?: string }>;
    retreat?: number;
    regulationMark?: string;
    pricing?: { cardmarket?: { trend?: number; low?: number; avg7?: number; avg30?: number } };
};

const BASE = "https://api.tcgdex.net/v2/es/cards";
const fmtEUR = (n?: number) =>
    typeof n === "number" ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n) : "—";

async function getCard(id: string) {
    const r = await fetch(`${BASE}/${id}`, { next: { revalidate: 3600 } });
    if (!r.ok) return null;
    const c: CardDetail = await r.json();
    return c;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const card = await getCard(id);
    return {
        title: card ? `${card.name} – Carta` : "Carta no encontrada",
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const c = await getCard(id);
    if (!c) notFound();

    const img = c.images?.large || c.images?.small || (c.image ? `${c.image}/high.webp` : undefined);

    return (
        <section className="mx-auto max-w-4xl p-4">
            <Link href="/" className="text-sm underline">← Volver</Link>

            <div className="mt-4 flex">
                <div>
                    {img ? (
                        <Image src={img} alt={c!.name} width={300} height={420} className="h-auto rounded" />
                    ) : (
                        <div className="grid aspect-[300/420] place-items-center rounded bg-black/5 text-xs">Sin imagen</div>
                    )}
                </div>

                <div className="ml-3">
                    <h1 className="text-3xl font-semibold">{c!.name}</h1>
                    <div className="mt-1 text-sm opacity-70">{c!.id}</div>

                    <dl className="mt-4 grid gap-2 text-sm">
                        {c?.category && <div><strong>Categoría:</strong> {c.category}</div>}
                        {c?.set?.name && <div><strong>Colección:</strong> {c.set.name}</div>}
                        {c?.rarity && <div><strong>Rareza:</strong> {c.rarity}</div>}
                        {c?.illustrator && <div><strong>Ilustrador/a:</strong> {c.illustrator}</div>}
                        {c?.hp && <div><strong>PS:</strong> {c.hp}</div>}
                        {c?.types?.length ? <div><strong>Tipos:</strong> {c.types.join(", ")}</div> : null}
                        {c?.stage && <div><strong>Etapa:</strong> {c.stage}</div>}
                        {typeof c?.retreat === "number" && <div><strong>Retirada:</strong> {c.retreat}</div>}
                        {c?.regulationMark && <div><strong>Regulación:</strong> {c.regulationMark}</div>}
                    </dl>

                    {(c?.description || c?.effect) && (
                        <p className="mt-4 text-sm leading-relaxed">
                            {c.description ?? c.effect}
                        </p>
                    )}

                    <div className="mt-6 text-sm">
                        <h2 className="text-lg font-medium">Cardmarket</h2>
                        {c?.pricing?.cardmarket ? (
                            <div className="mt-2 space-y-1">
                                <div>Trend: {fmtEUR(c.pricing.cardmarket.trend)} · Low: {fmtEUR(c.pricing.cardmarket.low)}</div>
                                {typeof c.pricing.cardmarket.avg7 === "number" || typeof c.pricing.cardmarket.avg30 === "number" ? (
                                    <div className="opacity-80">Media 7d: {fmtEUR(c.pricing.cardmarket.avg7)} · Media 30d: {fmtEUR(c.pricing.cardmarket.avg30)}</div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="opacity-70">No Cardmarket price</div>
                        )}
                    </div>
                </div>
            </div>

            <div>
                {c?.abilities?.length ? (
                    <div className="mt-6">
                        <h2 className="text-lg font-medium">Habilidades</h2>
                        <ul className="mt-2 space-y-2 text-sm">
                            {c.abilities.map((a, i) => (
                                <li key={i}>
                                    <strong>{a.type ? `${a.type}: ` : ""}{a.name}</strong>
                                    {": "}
                                    <span>{a.text ?? a.effect ?? "—"}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                {c?.attacks?.length ? (
                    <div className="mt-6">
                        <h2 className="text-lg font-medium">Ataques</h2>
                        <ul className="mt-2 space-y-3 text-sm">
                            {c.attacks.map((a, i) => (
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
                ) : null}
            </div>
        </section>
    );
}

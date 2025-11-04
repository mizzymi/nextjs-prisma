import { NextResponse } from "next/server";

type CardBrief = { id: string; name: string; image?: string };

const BASE = "https://api.tcgdex.net/v2/es/cards";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const category = (searchParams.get("category") ?? "").trim();
    const type = (searchParams.get("type") ?? "").trim();
    const setId = (searchParams.get("set") ?? "").trim();

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const ps = Math.max(1, Number(searchParams.get("ps") ?? 12));

    const params = new URLSearchParams();

    if (q) params.set("name", q);
    if (category) params.set("category", `eq:${category}`);
    if (type) params.set("types", `eq:${type}`);
    if (setId) params.set("set.id", `eq:${setId}`);

    params.set("pagination:page", String(page));
    params.set("pagination:itemsPerPage", String(ps));

    const listUrl = `${BASE}?${params.toString()}`;
    const listRes = await fetch(listUrl, { next: { revalidate: 300 } });
    if (!listRes.ok) return NextResponse.json({ items: [], page: 1, totalPages: 1 });

    const briefs: CardBrief[] = await listRes.json();

    const details = await Promise.all(
        briefs.map(b => fetch(`${BASE}/${b.id}`, { next: { revalidate: 300 } }).then(r => r.json()))
    );

    const items = details.map((c: any) => ({
        id: c.id,
        name: c.name,
        img: c.images?.large || c.images?.small || (c.image ? `${c.image}/high.webp` : undefined),
        cm: c.pricing?.cardmarket ? { trend: c.pricing.cardmarket.trend, low: c.pricing.cardmarket.low } : null,
    }));

    const countParams = new URLSearchParams(params);

    countParams.delete("pagination:page");
    countParams.delete("pagination:itemsPerPage");

    const countRes = await fetch(`${BASE}?${countParams.toString()}`, { next: { revalidate: 300 } });
    const allForCount: CardBrief[] = countRes.ok ? await countRes.json() : [];
    const totalPages = Math.max(1, Math.ceil(allForCount.length / ps));

    return NextResponse.json({ items, page, totalPages });
}

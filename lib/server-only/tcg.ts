import "server-only";
import type { CardDetail } from "@/lib/types/tcg";

const BASE = "https://api.tcgdex.net/v2/es/cards";

export async function getCard(id: string): Promise<CardDetail | null> {
    const r = await fetch(`${BASE}/${id}`, { next: { revalidate: 3600 } });

    if (!r.ok) return null;
    
    return r.json();
}

export function bestCardImage(c: CardDetail): string | undefined {
    return c.images?.large || c.images?.small || (c.image ? `${c.image}/high.webp` : undefined);
}

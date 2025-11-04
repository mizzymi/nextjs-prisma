import "server-only";
import { cache } from "react";

const BASE = "https://api.tcgdex.net/v2/es/cards";

type PriceResp = {
    pricing?: { cardmarket?: { trend?: number; low?: number } };
};

export const getPricingFor = cache(async (cardId: string): Promise<{ trend?: number; low?: number }> => {
    const r = await fetch(`${BASE}/${cardId}`, { next: { revalidate: 3600 } });

    if (!r.ok) return {};

    const data = (await r.json()) as PriceResp;
    const trend = typeof data?.pricing?.cardmarket?.trend === "number" ? data.pricing!.cardmarket!.trend : undefined;
    const low = typeof data?.pricing?.cardmarket?.low === "number" ? data.pricing!.cardmarket!.low : undefined;
    
    return { trend, low };
});

export type CardItem = {
    id: string;
    name: string;
    img?: string | null;
    cm?: { trend?: number; low?: number } | null;
};

export type CardListResponse = {
    items: CardItem[];
    page: number;
    totalPages: number;
};

export type FetchCardsArgs = {
    q?: string;
    category?: string;
    type?: string;
    setId?: string;
    page: number;
    ps: number;
    signal?: AbortSignal;
};

export async function fetchCards({
    q,
    category,
    type,
    setId,
    page,
    ps,
    signal,
}: FetchCardsArgs): Promise<CardListResponse> {
    const url = new URL("/api/cards/list", window.location.origin);
    if (q) url.searchParams.set("q", q);
    if (category) url.searchParams.set("category", category);
    if (type) url.searchParams.set("type", type);
    if (setId) url.searchParams.set("set", setId);
    url.searchParams.set("page", String(page));
    url.searchParams.set("ps", String(ps));

    const res = await fetch(url.toString(), { signal, cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar la lista de cartas");
    return res.json();
}

import { NextResponse } from "next/server";

const ROOT = "https://api.tcgdex.net/v2/es";

export async function GET() {
    const [typesRes, catsRes, setsRes] = await Promise.all([
        fetch(`${ROOT}/types`, { next: { revalidate: 86400 } }),
        fetch(`${ROOT}/categories`, { next: { revalidate: 86400 } }),
        fetch(`${ROOT}/sets`, { next: { revalidate: 86400 } }),
    ]);

    const [types, categories, setsBrief] = await Promise.all([
        typesRes.json(), catsRes.json(), setsRes.json()
    ]);

    const sets = (setsBrief as any[]).map(s => ({ id: s.id, name: s.name }));

    return NextResponse.json({ types, categories, sets });
}

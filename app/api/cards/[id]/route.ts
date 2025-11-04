import { NextRequest, NextResponse } from "next/server";
import { tcgdex } from "@/lib/tcgdex";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const card = await tcgdex.fetch("cards", id);
    return NextResponse.json(card);
}

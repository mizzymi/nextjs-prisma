import { NextResponse } from "next/server";
import { tcgdex } from "@/lib/tcgdex";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const card = await tcgdex.fetch("cards", params.id);
    
    return NextResponse.json(card);
}

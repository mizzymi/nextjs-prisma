import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { name } = await req.json().catch(() => ({}));
    await prisma.user.update({
        where: { email: session.user.email },
        data: { name: name ?? null },
    });

    return NextResponse.json({ ok: true });
}

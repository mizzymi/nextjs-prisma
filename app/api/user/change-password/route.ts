import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json().catch(() => ({}));
    if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Campos obligatorios" }, { status: 400 });
    }
    if (newPassword.length < 8) {
        return NextResponse.json({ error: "Mínimo 8 caracteres" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user?.passwordHash) return NextResponse.json({ error: "Usuario inválido" }, { status: 400 });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return NextResponse.json({ ok: true });
}

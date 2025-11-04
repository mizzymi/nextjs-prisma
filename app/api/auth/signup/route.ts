import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email y password son obligatorios" }, { status: 400 });
        }

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return NextResponse.json({ error: "Ese email ya está registrado" }, { status: 409 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await prisma.user.create({
            data: { email, name: name ?? null, passwordHash },
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error creando el usuario" }, { status: 500 });
    }
}

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export async function createDeck(formData: FormData): Promise<ActionResult> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) redirect("/login");

    const title = String(formData.get("title") ?? "").trim();

    if (!title) return { ok: false, error: "El título es obligatorio" };
    if (title.length > 80) return { ok: false, error: "Título demasiado largo" };

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, emailVerified: true },
    });

    if (!user) redirect("/login");
    if (!user.emailVerified) return { ok: false, error: "Debes verificar tu correo para crear decks." };

    await prisma.deck.create({ data: { title, userId: user.id } });

    revalidatePath("/dashboard");
    
    return { ok: true, message: "Deck creado" };
}

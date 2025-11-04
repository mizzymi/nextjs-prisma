"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ActionState = { ok: boolean | null; message?: string; error?: string };

export async function addToDeckAction(_: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { ok: false, error: "Debes iniciar sesión" };

    const cardId = String(formData.get("cardId") ?? "");
    const cardName = String(formData.get("cardName") ?? "");
    const cardImage = String(formData.get("cardImage") ?? "");
    const deckId = Number(formData.get("deckId"));

    if (!cardId || !cardName) return { ok: false, error: "Datos de carta inválidos" };
    if (!Number.isInteger(deckId)) return { ok: false, error: "DeckId inválido" };

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });
    if (!user) return { ok: false, error: "Usuario no encontrado" };

    const deck = await prisma.deck.findFirst({
        where: { id: deckId, userId: user.id },
        select: { id: true },
    });
    if (!deck) return { ok: false, error: "No tienes acceso a este deck" };

    await prisma.card.upsert({
        where: { deckId_id: { deckId, id: cardId } },
        update: { quantity: { increment: 1 }, name: cardName, image: cardImage || undefined },
        create: { deckId, id: cardId, name: cardName, image: cardImage || undefined, quantity: 1 },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/card/${cardId}`);

    return { ok: true, message: "Añadido correctamente" };
}

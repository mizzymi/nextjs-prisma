"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isEnergyName, normalizeName, totalForBaseName } from "@/lib/server-only/cards";
import { notFound, redirect } from "next/navigation";
import { getPricingFor } from "@/lib/server-only/pricing";

export type ActionState = {
    ok: boolean | null;
    message?: string;
    error?: string
};

export type DeckCardDTO = {
    id: string;
    name: string;
    image: string | null;
    quantity: number
};

export type DeckPageData = {
    deckId: number;
    title: string;
    createdAt: Date;
    cards: DeckCardDTO[];
    totalCards: number;
    totalLow: number;
    totalTrend: number;
};

export async function getDeckPageData(params: Promise<{ id: string }>): Promise<DeckPageData> {
    const { id } = await params;
    const deckId = Number(id);
    if (!Number.isInteger(deckId)) notFound();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) redirect("/login");

    const deck = await prisma.deck.findFirst({
        where: { id: deckId, userId: user.id },
        select: {
            id: true,
            title: true,
            createdAt: true,
            cards: { select: { id: true, name: true, image: true, quantity: true }, orderBy: { createdAt: "desc" } },
        },
    });
    if (!deck) notFound();

    const totalCards = deck.cards.reduce((s: number, c: { quantity: any; }) => s + Number(c.quantity), 0);

    const prices = await Promise.all(deck.cards.map((c: { id: any; }) => getPricingFor(c.id)));
    let totalLow = 0, totalTrend = 0;
    for (let i = 0; i < deck.cards.length; i++) {
        const q = Number(deck.cards[i].quantity);
        const p = prices[i];
        if (typeof p.low === "number") totalLow += p.low * q;
        if (typeof p.trend === "number") totalTrend += p.trend * q;
    }

    return {
        deckId: deck.id,
        title: deck.title,
        createdAt: deck.createdAt,
        cards: deck.cards.map((c: { id: any; name: any; image: any; quantity: any; }) => ({ id: c.id, name: c.name, image: c.image, quantity: c.quantity })),
        totalCards,
        totalLow,
        totalTrend,
    };
}

function revalidateDeckPaths(deckId: number) {
    revalidatePath(`/dashboard/deck/${deckId}`);
    revalidatePath("/dashboard");
}

export async function incrementCardAction(prev: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return { ok: false, error: "No autenticado" };

    const deckId = Number(formData.get("deckId"));
    const cardId = String(formData.get("cardId") ?? "");

    if (!Number.isInteger(deckId) || !cardId) return { ok: false, error: "Datos inválidos" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });

    if (!user) return { ok: false, error: "No autenticado" };

    const deck = await prisma.deck.findFirst({ where: { id: deckId, userId: user.id }, select: { id: true } });

    if (!deck) return { ok: false, error: "Sin acceso a este deck" };

    try {
        await prisma.$transaction(async (tx: { card: { findUnique: (arg0: { where: { deckId_id: { deckId: number; id: string; }; }; select: { name: boolean; }; }) => any; update: (arg0: { where: { deckId_id: { deckId: number; id: string; }; } | { deckId_id: { deckId: number; id: string; }; }; data: { quantity: { increment: number; }; } | { quantity: { increment: number; }; }; }) => any; }; }) => {
            const card = await tx.card.findUnique({ where: { deckId_id: { deckId, id: cardId } }, select: { name: true } });
            if (!card) throw new Error("Carta no encontrada");

            if (isEnergyName(card.name)) {
                await tx.card.update({ where: { deckId_id: { deckId, id: cardId } }, data: { quantity: { increment: 1 } } });
                return;
            }

            const base = normalizeName(card.name);
            const currentTotal = await totalForBaseName(deckId, base, tx);
            if (currentTotal >= 4) throw new Error("Máximo 4 copias por nombre base");

            await tx.card.update({ where: { deckId_id: { deckId, id: cardId } }, data: { quantity: { increment: 1 } } });
        });
    } catch (e: any) {
        return { ok: false, error: e?.message || "No se pudo incrementar" };
    }

    revalidateDeckPaths(deckId);

    return { ok: true };
}

export async function decrementCardAction(prev: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return { ok: false, error: "No autenticado" };

    const deckId = Number(formData.get("deckId"));
    const cardId = String(formData.get("cardId") ?? "");

    if (!Number.isInteger(deckId) || !cardId) return { ok: false, error: "Datos inválidos" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });

    if (!user) return { ok: false, error: "No autenticado" };

    const deck = await prisma.deck.findFirst({ where: { id: deckId, userId: user.id }, select: { id: true } });

    if (!deck) return { ok: false, error: "Sin acceso a este deck" };

    await prisma.$transaction(async (tx: { card: { findUnique: (arg0: { where: { deckId_id: { deckId: number; id: string; }; }; select: { quantity: boolean; }; }) => any; update: (arg0: { where: { deckId_id: { deckId: number; id: string; }; }; data: { quantity: { decrement: number; }; }; }) => any; delete: (arg0: { where: { deckId_id: { deckId: number; id: string; }; }; }) => any; }; }) => {
        const c = await tx.card.findUnique({ where: { deckId_id: { deckId, id: cardId } }, select: { quantity: true } });

        if (!c) return;
        if (c.quantity > 1) {
            await tx.card.update({ where: { deckId_id: { deckId, id: cardId } }, data: { quantity: { decrement: 1 } } });
        } else {
            await tx.card.delete({ where: { deckId_id: { deckId, id: cardId } } });
        }
    });

    revalidateDeckPaths(deckId);

    return { ok: true };
}

export async function removeCardAction(prev: ActionState, formData: FormData): Promise<ActionState> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return { ok: false, error: "No autenticado" };

    const deckId = Number(formData.get("deckId"));
    const cardId = String(formData.get("cardId") ?? "");

    if (!Number.isInteger(deckId) || !cardId) return { ok: false, error: "Datos inválidos" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });

    if (!user) return { ok: false, error: "No autenticado" };

    const deck = await prisma.deck.findFirst({ where: { id: deckId, userId: user.id }, select: { id: true } });

    if (!deck) return { ok: false, error: "Sin acceso a este deck" };

    await prisma.card.delete({ where: { deckId_id: { deckId, id: cardId } } });

    revalidateDeckPaths(deckId);

    return { ok: true, message: "Carta quitada" };
}

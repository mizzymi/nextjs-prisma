import "server-only";
import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: { id: true } });
}

export async function getUserDecks(userId: number) {
    return prisma.deck.findMany({
        where: { userId },
        select: { id: true, title: true },
        orderBy: { createdAt: "desc" },
    });
}

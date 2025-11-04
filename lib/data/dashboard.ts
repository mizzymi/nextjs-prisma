import "server-only";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export type DeckRow = { id: number; title: string; createdAt: Date };
export type DashboardUser = {
    id: number;
    email: string;
    name: string | null;
    emailVerified: Date | null;
};

export async function getDashboardData(): Promise<{
    user: DashboardUser;
    decks: DeckRow[];
    qtyByDeck: Map<number, number>;
    canCreate: boolean;
}> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, name: true, emailVerified: true },
    });
    if (!user) redirect("/login");

    const decks = await prisma.deck.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
    });

    const deckIds = decks.map((d: { id: any; }) => d.id);
    let qtyByDeck = new Map<number, number>();

    if (deckIds.length) {
        const totals = await prisma.card.groupBy({
            by: ["deckId"],
            where: { deckId: { in: deckIds } },
            _sum: { quantity: true },
        });
        qtyByDeck = new Map<number, number>(
            totals.map((t: { deckId: number; _sum: { quantity: any; }; }) => [t.deckId as number, t._sum.quantity ?? 0]),
        );
    }

    return {
        user,
        decks,
        qtyByDeck,
        canCreate: !!user.emailVerified,
    };
}

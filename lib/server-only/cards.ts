import "server-only";
import { prisma } from "@/lib/prisma";

export function fmtEUR(n?: number) {
    return typeof n === "number"
        ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n)
        : "—";
}

export function isEnergyName(name: string): boolean {
    const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return /^energia\b/.test(n) || /\benergy\b/.test(n);
}

export function normalizeName(name: string): string {
    let n = name.trim();

    n = n.replace(/[☆◇★]/g, "");
    n = n
        .replace(/\s*-\s*EX$/i, "")
        .replace(/\s+V-UNION$/i, "")
        .replace(/\s+(?:EX|ex|GX|gx|BREAK|break)$/i, "")
        .replace(/\s+V(?:MAX|STAR)?$/i, "")
        .replace(/\s+LV\.?X$/i, "")
        .replace(/\s+PRISM\s*STAR$/i, "")
        .replace(/^(?:M|Mega)\s+/i, "");

    return n.trim().toLowerCase();
}

export async function totalForBaseName(deckId: number, base: string, tx = prisma) {
    const cards = await tx.card.findMany({
        where: { deckId },
        select: { name: true, quantity: true },
    });

    return cards.reduce((sum: any, c: { name: string; quantity: any; }) => (normalizeName(c.name) === base ? sum + c.quantity : sum), 0);
}

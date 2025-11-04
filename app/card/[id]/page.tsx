import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCard, bestCardImage } from "@/lib/server-only/tcg";
import { getUserByEmail, getUserDecks } from "@/lib/server-only/decks";
import RecommendedSection from "./RecommendedSection";

import CardHeader from "./_components/CardHeader";
import CardImage from "./_components/CardImage";
import CardMetaList from "./_components/CardMetaList";
import CardmarketSection from "./_components/CardmarketSection";
import AbilitiesList from "./_components/AbilitiesList";
import AttacksList from "./_components/AttacksList";
import AddToDeckForm from "./_components/AddToDeckForm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const c = await getCard(id);
    
    if (!c) return { title: "Carta no encontrada" };

    const title = c.name;
    const tipos = c.types?.join(", ");
    const categoria = c.category;
    const desc =
        [categoria && `Categoría: ${categoria}`, tipos && `Tipos: ${tipos}`]
            .filter(Boolean)
            .join(" · ") || "Carta de Pokémon";

    const img = bestCardImage(c);

    return {
        title,
        description: desc,
        openGraph: {
            title,
            description: desc,
            type: "article",
            images: img ? [{ url: img, width: 1200, height: 630 }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: desc,
            images: img ? [img] : undefined,
        },
        alternates: { canonical: `/card/${id}` },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const c = await getCard(id);
    if (!c) notFound();

    const img = bestCardImage(c);
    const preName = (c as any).evolveFrom ?? null;

    const session = await getServerSession(authOptions);
    let userDecks: Array<{ id: number; title: string }> = [];
    if (session?.user?.email) {
        const user = await getUserByEmail(session.user.email);
        if (user) {
            userDecks = await getUserDecks(user.id);
        }
    }

    return (
        <section className="mx-auto max-w-4xl p-4">
            <Link href="/" className="text-sm underline">← Volver</Link>

            <div className="mt-4 flex">
                <div>
                    <CardImage src={img} alt={c.name} />
                </div>

                <div className="ml-3">
                    <CardHeader name={c.name} id={c.id} />

                    <AddToDeckForm
                        cardId={c.id}
                        cardName={c.name}
                        cardImage={img}
                        userDecks={userDecks}
                        loggedIn={!!session?.user?.email}
                    />

                    <CardMetaList
                        category={c.category}
                        setName={c.set?.name}
                        rarity={c.rarity}
                        illustrator={c.illustrator}
                        hp={c.hp}
                        types={c.types}
                        stage={c.stage}
                        retreat={c.retreat}
                        regulationMark={c.regulationMark}
                    />

                    {(c.description || c.effect) && (
                        <p className="mt-4 text-sm leading-relaxed">
                            {c.description ?? c.effect}
                        </p>
                    )}

                    <CardmarketSection
                        trend={c.pricing?.cardmarket?.trend}
                        low={c.pricing?.cardmarket?.low}
                        avg7={c.pricing?.cardmarket?.avg7}
                        avg30={c.pricing?.cardmarket?.avg30}
                    />
                </div>
            </div>

            <AbilitiesList abilities={c.abilities} />
            <AttacksList attacks={c.attacks} />

            <RecommendedSection currentId={c.id} name={c.name} preName={preName} />
        </section>
    );
}

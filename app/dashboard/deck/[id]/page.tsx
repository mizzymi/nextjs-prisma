import Link from "next/link";
import DeckHeader from "./_components/DeckHeader";
import DeckCardList from "./_components/DeckCardList";
import { getDeckPageData } from "./actions";

type PageProps = { params: Promise<{ id: string }> };

export default async function DeckPage({ params }: PageProps) {
    const data = await getDeckPageData(params);

    return (
        <section className="mx-auto max-w-4xl p-4">
            <Link href="/dashboard" className="text-sm underline">← Volver al dashboard</Link>

            <DeckHeader
                title={data.title}
                createdAt={data.createdAt}
                totalCards={data.totalCards}
                totalLow={data.totalLow}
                totalTrend={data.totalTrend}
            />

            <DeckCardList deckId={data.deckId} cards={data.cards} />
        </section>
    );
}

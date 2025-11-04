import DeckCardItem, { DeckCard } from "./DeckCardItem";

export default function DeckCardList({
    deckId,
    cards,
}: {
    deckId: number;
    cards: DeckCard[];
}) {
    if (cards.length === 0) {
        return <p className="text-sm text-black/70">Este deck aún no tiene cartas.</p>;
    }

    return (
        <ul className="rounded border border-black/10 divide-y divide-black/10">
            {cards.map((c) => (
                <DeckCardItem key={`${deckId}-${c.id}`} deckId={deckId} card={c} />
            ))}
        </ul>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    incrementCardAction,
    decrementCardAction,
    removeCardAction,
    type ActionState,
} from "../actions";

export type DeckCard = { id: string; name: string; image: string | null; quantity: number };

import { useActionState } from "react";

const INITIAL: ActionState = { ok: null };

export default function DeckCardItem({ deckId, card }: { deckId: number; card: DeckCard }) {
    const [incState, incAction] = useActionState(incrementCardAction, INITIAL);
    const [decState, decAction] = useActionState(decrementCardAction, INITIAL);
    const [remState, remAction] = useActionState(removeCardAction, INITIAL);

    useEffect(() => {
        if (incState.ok === false) toast.error(incState.error!);
        if (incState.ok === true && incState.message) toast.success(incState.message);
    }, [incState]);

    useEffect(() => {
        if (decState.ok === false) toast.error(decState.error!);
    }, [decState]);

    useEffect(() => {
        if (remState.ok === false) toast.error(remState.error!);
        if (remState.ok === true && remState.message) toast.success(remState.message);
    }, [remState]);

    return (
        <li className="p-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={`/card/${card.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-[52px] flex-shrink-0">
                    {card.image ? (
                        <Image src={card.image} alt={card.name} width={52} height={72}
                            className="h-auto rounded border border-black/10" />
                    ) : (
                        <div className="grid place-items-center w-[52px] h-[72px] rounded bg-black/5 text-[10px] text-black/60">
                            Sin imagen
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-medium truncate">{card.name}</p>
                    <p className="text-xs text-black/60 break-all">{card.id}</p>
                </div>
            </Link>

            <div className="flex items-center gap-2">
                <form action={decAction}>
                    <input type="hidden" name="deckId" value={deckId} />
                    <input type="hidden" name="cardId" value={card.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-sm" aria-label="Restar 1">−</button>
                </form>

                <div className="w-10 text-center text-sm tabular-nums">x{card.quantity}</div>

                <form action={incAction}>
                    <input type="hidden" name="deckId" value={deckId} />
                    <input type="hidden" name="cardId" value={card.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-sm" aria-label="Sumar 1" title="Máximo 4 por nombre base">+</button>
                </form>

                <form action={remAction}>
                    <input type="hidden" name="deckId" value={deckId} />
                    <input type="hidden" name="cardId" value={card.id} />
                    <button type="submit" className="rounded border px-2 py-1 text-sm" aria-label="Quitar carta" title="Quitar del deck">Quitar</button>
                </form>
            </div>
        </li>
    );
}

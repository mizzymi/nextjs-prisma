"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { addToDeckAction, type ActionState } from "../actions";

function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="rounded bg-black text-white px-3 py-1 disabled:opacity-60" disabled={pending}>
            {pending ? "Añadiendo..." : "Añadir a deck"}
        </button>
    );
}

const INITIAL: ActionState = { ok: null };

export default function AddToDeckForm({
    cardId,
    cardName,
    cardImage,
    userDecks,
    loggedIn,
}: {
    cardId: string;
    cardName: string;
    cardImage?: string;
    userDecks: Array<{ id: number; title: string }>;
    loggedIn: boolean;
}) {
    if (!loggedIn) return null;

    const [state, formAction] = useActionState(addToDeckAction, INITIAL);

    useEffect(() => {
        if (state.ok === true) toast.success(state.message ?? "Añadido correctamente");
        if (state.ok === false && state.error) toast.error(state.error);
    }, [state]);

    if (userDecks.length === 0) {
        return (
            <p className="mt-4 text-sm opacity-80">
                No tienes decks aún. Crea uno en tu <Link href="/dashboard" className="underline">Dashboard</Link>.
            </p>
        );
    }

    return (
        <form action={formAction} className="mt-4 flex gap-2 items-center">
            <input type="hidden" name="cardId" value={cardId} />
            <input type="hidden" name="cardName" value={cardName} />
            <input type="hidden" name="cardImage" value={cardImage ?? ""} />
            <select name="deckId" className="rounded border px-2 py-1">
                {userDecks.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                ))}
            </select>
            <SubmitBtn />
        </form>
    );
}

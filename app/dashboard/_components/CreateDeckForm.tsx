"use client";
import { toast } from "sonner";
import { createDeck } from "../actions";

export default function CreateDeckForm({ canCreate }: { canCreate: boolean }) {
    const onCreate = async (formData: FormData): Promise<void> => {
        const res = await createDeck(formData);
        if (!res.ok) {
            toast.error(res.error);
            return;
        }
        toast.success(res.message ?? "Deck creado");
    };

    return (
        <form action={onCreate} className="mt-3 mb-4 flex flex-col gap-2 sm:flex-row">
            <input name="title" required placeholder="Nombre del deck"
                className="flex-1 rounded border border-black/20 px-3 py-2" />
            <button type="submit" className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
                disabled={!canCreate}>
                Crear deck
            </button>
        </form>
    );
}

"use client";
import { useEffect, useState } from "react";

type Meta = { types: string[]; categories: string[]; sets: { id: string; name: string }[] };

export default function FilterOptions({
    q, onQChange,
    category, onCategoryChange,
    type, onTypeChange,
    setId, onSetIdChange,
}: {
    q: string; onQChange: (v: string) => void;
    category: string; onCategoryChange: (v: string) => void;
    type: string; onTypeChange: (v: string) => void;
    setId: string; onSetIdChange: (v: string) => void;
}) {
    const [meta, setMeta] = useState<Meta>({ types: [], categories: [], sets: [] });

    useEffect(() => {
        let ok = true;
        fetch("/api/cards/meta")
            .then(r => r.json())
            .then((m) => { if (ok) setMeta(m); })
            .catch(() => { });
        return () => { ok = false; };
    }, []);

    return (
        <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <input
                value={q}
                onChange={(e) => onQChange(e.target.value)}
                placeholder="Buscar por nombre…"
                className="rounded border px-3 py-2"
            />

            <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="rounded border px-3 py-2"
            >
                <option value="">Todas las categorías</option>
                <option value="Pokémon">Pokémon</option>
                <option value="Entrenador">Entrenador</option>
                <option value="Energía">Energía</option>
            </select>

            <select
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                className="rounded border px-3 py-2"
            >
                <option value="">Todos los tipos</option>
                {meta.types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>

            <div className="flex gap-2">
                <input
                    list="sets"
                    value={setId}
                    onChange={(e) => onSetIdChange(e.target.value)}
                    placeholder="Set (ej. sv06)"
                    className="flex-1 rounded border px-3 py-2"
                />
                <datalist id="sets">
                    {meta.sets.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </datalist>
                {setId && (
                    <button
                        type="button"
                        onClick={() => onSetIdChange("")}
                        className="rounded border px-3 py-2"
                        aria-label="Limpiar set"
                    >
                        x
                    </button>
                )}
            </div>
        </div>
    );
}

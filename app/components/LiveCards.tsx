"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ResponsivePageSizer from "./ResponsivePageSizer";
import FilterOptions from "./FilterOptions";

const fmtEUR = (n?: number) =>
    typeof n === "number"
        ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n)
        : "—";

export default function LiveCards() {
    const sp = useSearchParams();
    const ps = Math.max(1, Number(sp.get("ps") ?? 12));

    const [q, setQ] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [setId, setSetId] = useState("");

    const [page, setPage] = useState(1);

    const [data, setData] = useState<{ items: any[]; page: number; totalPages: number }>({
        items: [],
        page: 1,
        totalPages: 1,
    });

    const [debouncedQ, setDebouncedQ] = useState(q);
    const abortRef = useRef<AbortController | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(q), 350);
        return () => clearTimeout(t);
    }, [q]);

    useEffect(() => {
        setPage(1);
    }, [debouncedQ, category, type, setId, ps]);

    useEffect(() => {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        startTransition(async () => {
            const u = new URL("/api/cards/list", window.location.origin);
            if (debouncedQ) u.searchParams.set("q", debouncedQ);
            if (category) u.searchParams.set("category", category);
            if (type) u.searchParams.set("type", type);
            if (setId) u.searchParams.set("set", setId);
            u.searchParams.set("page", String(page));
            u.searchParams.set("ps", String(ps));

            const res = await fetch(u.toString(), { signal: ac.signal });
            if (!res.ok) return;
            const json = await res.json();
            setData(json);
        });

        return () => ac.abort();
    }, [debouncedQ, category, type, setId, page, ps]);

    return (
        <>
            <ResponsivePageSizer rows={6} />

            <FilterOptions
                q={q} onQChange={setQ}
                category={category} onCategoryChange={setCategory}
                type={type} onTypeChange={setType}
                setId={setId} onSetIdChange={setSetId}
            />

            <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {data.items.map((c) => (
                    <li key={c.id} className="rounded border p-3">
                        <Link href={`/card/${c.id}`} className="block">
                            <div className="relative aspect-[2/3] w-full">
                                {c.img ? (
                                    <Image
                                        src={c.img}
                                        alt={c.name}
                                        fill
                                        sizes="(max-width:640px)50vw,(max-width:768px)33vw,(max-width:1024px)25vw,(max-width:1280px)20vw,16vw"
                                        className="rounded object-contain"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center rounded bg-black/5 text-xs">Sin imagen</div>
                                )}
                            </div>
                            <div className="mt-2 text-sm font-medium line-clamp-2">{c.name}</div>
                            {c.cm ? (
                                <div className="mt-2 text-xs">
                                    <strong>Tendencia:</strong> {fmtEUR(c.cm.trend)} · <strong>Mínimo:</strong> {fmtEUR(c.cm.low)}
                                </div>
                            ) : (
                                <div className="mt-2 text-xs opacity-60">Sin precio</div>
                            )}
                        </Link>
                    </li>
                ))}

                {isPending && data.items.length === 0 &&
                    Array.from({ length: ps }).map((_, i) => (
                        <li key={`s${i}`} className="rounded border p-3 animate-pulse">
                            <div className="aspect-[2/3] w-full rounded bg-black/10" />
                            <div className="mt-2 h-4 w-3/4 rounded bg-black/10" />
                        </li>
                    ))
                }
            </ul>

            <nav className="mt-6 flex items-center justify-between">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={data.page <= 1 || isPending}
                    className="rounded border px-3 py-2 disabled:opacity-50"
                >
                    ← Anterior
                </button>

                <span className="text-sm">Página {data.page} de {data.totalPages}</span>

                <button
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    disabled={data.page >= data.totalPages || isPending}
                    className="rounded border px-3 py-2 disabled:opacity-50"
                >
                    Siguiente →
                </button>
            </nav>
        </>
    );
}

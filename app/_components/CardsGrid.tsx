"use client";

import Image from "next/image";
import Link from "next/link";
import { fmtEUR } from "../../lib/utils";
import type { CardItem } from "./actions";

export default function CardsGrid({
    items,
    ps,
    isPending,
}: {
    items: CardItem[];
    ps: number;
    isPending: boolean;
}) {
    return (
        <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((c) => (
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
                                <div className="grid h-full w-full place-items-center rounded bg-black/5 text-xs">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <div className="mt-2 text-sm font-medium line-clamp-2">{c.name}</div>
                        {c.cm ? (
                            <div className="mt-2 text-xs">
                                <strong>Trend:</strong> {fmtEUR(c.cm.trend)} · <strong>Low:</strong> {fmtEUR(c.cm.low)}
                            </div>
                        ) : (
                            <div className="mt-2 text-xs opacity-60">No Cardmarket price</div>
                        )}
                    </Link>
                </li>
            ))}

            {isPending && items.length === 0 &&
                Array.from({ length: ps }).map((_, i) => (
                    <li key={`s${i}`} className="rounded border p-3 animate-pulse">
                        <div className="aspect-[2/3] w-full rounded bg-black/10" />
                        <div className="mt-2 h-4 w-3/4 rounded bg-black/10" />
                    </li>
                ))
            }
        </ul>
    );
}

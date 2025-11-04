"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import ResponsivePageSizer from "./ResponsivePageSizer";
import FilterOptions from "./FilterOptions";
import CardsGrid from "./CardsGrid";
import Pagination from "./Pagination";
import { fetchCards, type CardListResponse } from "./actions";

export default function LiveCards() {
  const sp = useSearchParams();
  const ps = useMemo(() => Math.max(1, Number(sp.get("ps") ?? 12)), [sp]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [setId, setSetId] = useState("");

  const [page, setPage] = useState(1);
  const [data, setData] = useState<CardListResponse>({ items: [], page: 1, totalPages: 1 });
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
      try {
        const json = await fetchCards({
          q: debouncedQ || undefined,
          category: category || undefined,
          type: type || undefined,
          setId: setId || undefined,
          page,
          ps,
          signal: ac.signal,
        });
        setData(json);
      } catch {
      }
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

      <CardsGrid items={data.items} ps={ps} isPending={isPending} />

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        isPending={isPending}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(data.totalPages, p + 1))}
      />
    </>
  );
}

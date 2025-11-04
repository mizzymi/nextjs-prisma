import Link from "next/link";
import Image from "next/image";

type CardBrief = { id: string; name: string; image?: string };
type CardDetail = {
  id: string; name: string;
  images?: { small?: string; large?: string };
  image?: string;
};

const BASE = "https://api.tcgdex.net/v2/es/cards";

const SUFFIXES = /\s+(?:V(?:MAX|STAR)?|GX|EX|ex|BREAK|LV\.X)$/i;
const smartBaseName = (s: string) => s.replace(SUFFIXES, "").trim();

const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

async function toDetail(b: CardBrief): Promise<CardDetail> {
  const r = await fetch(`${BASE}/${b.id}`, { next: { revalidate: 43200 } });
  return r.json();
}

async function fetchByName(name: string): Promise<CardBrief[]> {
  const res = await fetch(`${BASE}?name=${encodeURIComponent(name)}`, { next: { revalidate: 43200 } });
  return res.ok ? await res.json() : [];
}

export default async function RecommendedSection({
  currentId,
  name,
  preName,
  limit = 1000,
}: {
  currentId: string;
  name: string;
  preName?: string | null;
  limit?: number;
}) {
  const base = smartBaseName(name);
  const basePre = preName ? smartBaseName(preName) : null;

  let sameBrief = await fetchByName(base);
  let same = sameBrief.filter(b => norm(b.name).startsWith(norm(base)));

  if (same.length === 0 && base.length >= 3) {
    const alt = await fetchByName(base.slice(0, 3));
    same = alt.filter(b => norm(b.name).startsWith(norm(base)));
  }

  let pre: CardBrief[] = [];
  if (basePre) {
    let preBrief = await fetchByName(basePre);
    pre = preBrief.filter(b => norm(b.name).startsWith(norm(basePre)));
    if (pre.length === 0 && basePre.length >= 3) {
      const alt = await fetchByName(basePre.slice(0, 3));
      pre = alt.filter(b => norm(b.name).startsWith(norm(basePre)));
    }
  }

  const evoRes = await fetch(`${BASE}?evolveFrom=eq:${encodeURIComponent(base)}`, { next: { revalidate: 43200 } });
  const evo: CardBrief[] = evoRes.ok ? await evoRes.json() : [];

  const merged = [...same, ...pre, ...evo].filter(b => b.id !== currentId);
  const seen = new Set<string>();
  const uniq = merged.filter(b => (seen.has(b.id) ? false : (seen.add(b.id), true))).slice(0, limit);

  if (uniq.length === 0) return null;

  const details: CardDetail[] = await Promise.all(uniq.map(toDetail));

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-medium">Recomendados</h2>
      <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {details.map((c) => {
          const img = c.images?.large || c.images?.small || (c.image ? `${c.image}/high.webp` : undefined);
          return (
            <li key={c.id} className="rounded border p-3">
              <Link href={`/card/${c.id}`} className="block">
                <div className="relative aspect-[2/3] w-full">
                  {img ? (
                    <Image
                      src={img}
                      alt={c.name}
                      fill
                      className="rounded object-contain"
                      sizes="(max-width:640px)50vw,(max-width:768px)33vw,(max-width:1024px)25vw,(max-width:1280px)20vw,16vw"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center rounded bg-black/5 text-xs">Sin imagen</div>
                  )}
                </div>
                <div className="mt-2 line-clamp-2 text-sm font-medium">{c.name}</div>
                <div className="text-xs opacity-60">{c.id}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

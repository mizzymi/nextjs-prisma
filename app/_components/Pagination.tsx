"use client";

export default function Pagination({
    page,
    totalPages,
    isPending,
    onPrev,
    onNext,
}: {
    page: number;
    totalPages: number;
    isPending: boolean;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <nav className="mt-6 flex items-center justify-between">
            <button
                onClick={onPrev}
                disabled={page <= 1 || isPending}
                className="rounded border px-3 py-2 disabled:opacity-50"
            >
                ← Anterior
            </button>

            <span className="text-sm">Página {page} de {totalPages}</span>

            <button
                onClick={onNext}
                disabled={page >= totalPages || isPending}
                className="rounded border px-3 py-2 disabled:opacity-50"
            >
                Siguiente →
            </button>
        </nav>
    );
}

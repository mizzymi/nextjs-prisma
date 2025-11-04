"use client";
import { useState } from "react";

export default function UpdateProfileForm({ initialName }: { initialName: string }) {
    const [name, setName] = useState(initialName);
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                setMsg(null);
                setLoading(true);
                const res = await fetch("/api/user/update-profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name }),
                });
                const data = await res.json().catch(() => ({}));
                setMsg(res.ok ? "Nombre actualizado" : (data?.error ?? "Error actualizando"));
                setLoading(false);
            }}
            className="border border-black/10 rounded p-4 space-y-3"
        >
            <h3 className="font-semibold">Editar nombre de usuario</h3>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Tu nombre"
            />
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-teal-700 text-white rounded disabled:opacity-60 cursor-pointer"
            >
                {loading ? "Guardando..." : "Guardar"}
            </button>
            {msg && <p className="text-sm">{msg}</p>}
        </form>
    );
}

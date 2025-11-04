"use client";
import { useState } from "react";

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        if (newPassword !== repeat) {
            setMsg("Las contraseñas no coinciden");
            return;
        }
        if (newPassword.length < 8) {
            setMsg("Mínimo 8 caracteres");
            return;
        }
        setLoading(true);
        const res = await fetch("/api/user/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await res.json().catch(() => ({}));
        setMsg(res.ok ? "Contraseña cambiada" : (data?.error ?? "Error cambiando contraseña"));
        setLoading(false);
        if (res.ok) {
            setCurrentPassword("");
            setNewPassword("");
            setRepeat("");
        }
    };

    return (
        <form onSubmit={onSubmit} className="border border-black/10 rounded p-4 space-y-3">
            <h3 className="font-semibold">Cambiar contraseña</h3>
            <input
                type="password"
                placeholder="Contraseña actual"
                className="p-2 border rounded w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Nueva contraseña"
                className="p-2 border rounded w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Repite la nueva contraseña"
                className="p-2 border rounded w-full"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
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

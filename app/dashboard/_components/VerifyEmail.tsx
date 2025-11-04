"use client";
import { useState } from "react";

export default function VerifyEmail({ emailVerified }: { emailVerified: boolean }) {
    const [msg, setMsg] = useState<string | null>(null);
    const [link, setLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (emailVerified) {
        return (
            <div className="border border-black/10 rounded p-4">
                <h3 className="font-semibold">Verificar email</h3>
                <p className="text-sm text-green-700">Tu email ya está verificado.</p>
            </div>
        );
    }

    const request = async () => {
        setLoading(true);
        setMsg(null);
        setLink(null);
        const res = await fetch("/api/user/verify-email/request", { method: "POST" });
        const data = await res.json().catch(() => ({}));
        setLoading(false);
        if (!res.ok) {
            setMsg(data?.error ?? "No se pudo enviar el email");
        } else {
            setMsg("Correo enviado. Revisa tu bandeja.");
            if (data.preview) setLink(data.preview);
        }
    };


    return (
        <div className="border border-black/10 rounded p-4 space-y-3">
            <h3 className="font-semibold">Verificar email</h3>
            <p className="text-sm">Tu email aún no está verificado.</p>
            <button
                onClick={request}
                disabled={loading}
                className="px-4 py-2 bg-teal-700 text-white rounded disabled:opacity-60 cursor-pointer"
            >
                {loading ? "Enviando..." : "Enviar verificación"}
            </button>
            {msg && <p className="text-sm">{msg}</p>}
        </div>
    );
}

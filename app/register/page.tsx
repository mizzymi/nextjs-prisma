"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { impact } from "../fonts";

export default function SignupForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const n = name.trim();
        const em = email.trim().toLowerCase();
        const pw = password.trim();
        const pw2 = repeatPassword.trim();

        if (!n || !em || !pw || !pw2) {
            toast.error("Rellena todos los campos");
            return;
        }
        if (pw !== pw2) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        if (pw.length < 8) {
            toast.error("La contraseña debe tener mínimo 8 caracteres");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: n, email: em, password: pw }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "No se pudo crear la cuenta");
            }

            const r = await signIn("credentials", {
                email: em,
                password: pw,
                redirect: false, 
            });

            if (r?.error) {
                toast.error(r.error === "CredentialsSignin" ? "Credenciales inválidas" : r.error);
                return;
            }

            toast.success("Cuenta creada");
            router.push("/");
            router.refresh();
        } catch (err: any) {
            toast.error(err?.message || "Error creando la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col items-center justify-center p-4">
            <h2 className={`${impact.className} text-2xl`}>Regístrate</h2>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Nombre de usuario"
                autoComplete="username"
                className="p-2 mb-3 border rounded w-64"
                disabled={loading}
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="p-2 mb-3 border rounded w-64"
                disabled={loading}
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Contraseña"
                autoComplete="new-password"
                className="p-2 mb-3 border rounded w-64"
                disabled={loading}
            />
            <input
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                type="password"
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                className="p-2 mb-4 border rounded w-64"
                disabled={loading}
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-teal-700 cursor-pointer rounded-lg text-white px-4 py-2 disabled:opacity-60"
            >
                {loading ? "Creando..." : "Crear cuenta"}
            </button>

            <br />
            <p className="text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-teal-700 cursor-pointer underline-offset-2 hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </form>
    );
}

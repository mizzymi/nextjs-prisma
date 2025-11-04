"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { impact } from "../fonts";

export default function SigninForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const em = email.trim().toLowerCase();
        const pw = password.trim();

        if (!em || !pw) {
            toast.error("Introduce email y contraseña");
            return;
        }
        try {
            setLoading(true);
            const r = await signIn("credentials", {
                email: em,
                password: pw,
                redirect: false, 
            });

            if (r?.error) {
                toast.error(r.error === "CredentialsSignin" ? "Credenciales inválidas" : r.error);
                return;
            }

            toast.success("¡Bienvenido!");
            router.push("/");
            router.refresh();
        } catch (err: any) {
            toast.error(err?.message || "No se pudo iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} className="h-full flex flex-col items-center justify-center p-4">
            <h2 className={`${impact.className} text-2xl`}>Iniciar Sesión</h2>

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
                autoComplete="current-password"
                className="p-2 mb-4 border rounded w-64"
                disabled={loading}
            />

            <button
                type="submit"
                className="cursor-pointer bg-teal-700 rounded-lg text-white px-4 py-2 disabled:opacity-60"
                disabled={loading}
            >
                {loading ? "Entrando..." : "Entrar"}
            </button>

            <br />
            <p className="text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-teal-700 cursor-pointer underline-offset-2 hover:underline">
                    Regístrate
                </Link>
            </p>
        </form>
    );
}

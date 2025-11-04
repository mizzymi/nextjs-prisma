import Link from "next/link";
import { impact } from "../fonts";
import UpdateProfileForm from "./_components/UpdateProfileForm";
import ChangePasswordForm from "./_components/ChangePasswordForm";
import VerifyEmail from "./_components/VerifyEmail";
import SignOutButton from "./_components/SignOutButton";
import CreateDeckForm from "./_components/CreateDeckForm";
import { getDashboardData } from "@/lib/data/dashboard";

export default async function DashboardPage() {
    const { user, decks, qtyByDeck, canCreate } = await getDashboardData();

    return (
        <div className="p-3 flex flex-col gap-3 sm:flex-row">
            <div>
                <section>
                    <h2 className={`${impact.className} text-2xl`}>Tu cuenta</h2>
                    <p className="text-sm text-black/70">Email: {user.email}</p>
                    <p className="text-sm text-black/70">Nombre: {user.name ?? "—"}</p>
                    <p
                        className={`text-sm ${user.emailVerified ? "text-green-700" : "text-amber-700"}`}
                    >
                        Estado email: {user.emailVerified ? "VERIFICADO" : "PENDIENTE"}
                    </p>
                </section>

                <section className="space-y-6">
                    <UpdateProfileForm initialName={user.name ?? ""} />
                    <ChangePasswordForm />
                    <VerifyEmail emailVerified={!!user.emailVerified} />
                    <SignOutButton />
                </section>
            </div>

            <section className="flex-1">
                <h2 className={`${impact.className} text-2xl`}>Tus decks</h2>

                <CreateDeckForm canCreate={canCreate} />

                {decks.length === 0 ? (
                    <p className="text-sm text-black/70">Aún no tienes decks.</p>
                ) : (
                    <ul className="divide-y divide-black/10 rounded border border-black/10">
                        {decks.map(d => (
                            <li key={d.id} className="p-3 flex items-center justify-between">
                                <Link
                                    href={`/dashboard/deck/${d.id}`}
                                    className="font-medium underline-offset-2 hover:underline"
                                >
                                    <p className="font-medium">{d.title}</p>
                                    <p className="text-xs text-black/60">
                                        {new Date(d.createdAt).toLocaleDateString("es-ES")} ·{" "}
                                        {qtyByDeck.get(d.id) ?? 0} cartas
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

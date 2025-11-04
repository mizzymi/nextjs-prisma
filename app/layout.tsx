import "./globals.css";
import type { Metadata } from "next";
import { lucidaSansUnicode, impact } from "./fonts";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "PokeDeck",
  description: "Pokemon deck maker and pokemon tcg card searcher",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es" className={`${lucidaSansUnicode.variable} ${impact.variable}`}>
      <body className={`${lucidaSansUnicode.className} flex flex-col bg-background text-foreground font-sans antialiased h-dvh`}>
        <header className="border-b border-black/10 p-4 flex items-center justify-between">
          <Link prefetch={false} href={`/`}>
            <h1 className={`${impact.className} text-3xl`}>
              PokeDeck
              <span className={`${lucidaSansUnicode.className} text-xs`}> By: REIMII</span>
            </h1>
          </Link>

          {session?.user ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </header>

        <main className="p-4 grow">{children}</main>
        <Toaster richColors position="top-center" />
        <footer className="border-t border-black/10 p-4">
          © REIMII {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}

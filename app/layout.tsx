import './globals.css';
import type { Metadata } from 'next';
import { lucidaSansUnicode, impact } from './fonts';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PokeDeck',
  description: 'Pokemon deck maker and pokemon tcg card searcher',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${lucidaSansUnicode.variable} ${impact.variable}`}>
      <body className={`${lucidaSansUnicode.className} flex flex-col bg-background text-foreground font-sans antialiased h-dvh`}>
        <header className='border-b border-black/10 p-4'>
          <Link
            prefetch={false}
            href={`/`}
          >
            <h1 className={`${impact.className} text-3xl`}>PokeDeck<span className={`${lucidaSansUnicode.className} text-xs`}> By: REIMII</span></h1>
          </Link>
        </header>
        <main className='p-4 flex-1'>{children}</main>
        <footer className='border-t border-black/10 p-4'>
          © REIMII {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { impact, lucidaSansUnicode } from './fonts';

export default function NotFound() {
  return (
    <section className='grid min-h-[60vh] place-items-center text-center h-full'>
      <div>
        <h1 className={`${impact.className} text-5xl`}>404</h1>
        <p className='mt-2'>Página no encontrada</p>
        <Link href='/' className='mt-4 inline-block underline'>
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(req: NextRequest) {
    const token = req.cookies.get('pokedeck_session')?.value
    const isProtected = req.nextUrl.pathname.startsWith('/decks')
    
    if (isProtected && !token) {
        const url = new URL('/login', req.url)
        return NextResponse.redirect(url)
    }
    return NextResponse.next()
}


export const config = { matcher: ['/decks/:path*'] }
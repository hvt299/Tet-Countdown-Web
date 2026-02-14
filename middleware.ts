import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password');

    const isProtectedRoute =
        pathname.startsWith('/xin-chu') ||
        pathname.startsWith('/hai-loc') ||
        pathname.startsWith('/tro-choi') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/calligraphy-history');

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/forgot-password',
        '/reset-password',
        '/auth/verify',
        '/xin-chu',
        '/calligraphy-history',
        '/hai-loc',
        '/tro-choi',
        '/profile'
    ],
};
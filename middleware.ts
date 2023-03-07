import type {NextRequest, NextFetchEvent} from 'next/server';
import {NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

const secret = process.env.SECRET;

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const session = await getToken({req, secret, raw: true});
  const {pathname} = req.nextUrl;

  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/sign-up')) {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
}

export const config = {
  matcher: ['/auth/login', '/auth/sign-up'],
};

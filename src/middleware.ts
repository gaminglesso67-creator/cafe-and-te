import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'saanjh_sanity_session';

/**
 * Server-Side Edge Middleware protecting all `/admin/*` routes.
 * Blocks unauthenticated visitors from accessing `/admin` directly; redirects them
 * to `/admin/login` (the Sanity Studio Cloud CMS Gateway) unless a valid server-issued
 * `saanjh_sanity_session` HttpOnly cookie matching `SANITY_API_WRITE_TOKEN` is present.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const expectedToken =
      process.env.SANITY_API_WRITE_TOKEN?.trim() ||
      process.env.ADMIN_ACCESS_TOKEN?.trim() ||
      '';
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

    const isAuthorized =
      Boolean(expectedToken) &&
      expectedToken !== 'your_sanity_write_token' &&
      sessionCookie === expectedToken;

    if (!isAuthorized) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};


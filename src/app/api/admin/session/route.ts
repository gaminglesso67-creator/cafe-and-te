import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/spam-guard';
import { isSanityConfigured, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/sanity/env';

const ADMIN_COOKIE_NAME = 'caffe_te_sanity_session';

function getExpectedServerToken(): string | null {
  const token =
    process.env.SANITY_API_WRITE_TOKEN?.trim() ||
    process.env.ADMIN_ACCESS_TOKEN?.trim() ||
    '';
  if (!token || token === 'your_sanity_write_token') {
    return null;
  }
  return token;
}

export async function GET() {
  return NextResponse.json({
    sanityConfigured: isSanityConfigured(),
    projectId: SANITY_PROJECT_ID || null,
    studioUrl: SANITY_STUDIO_URL,
    serverTokenConfigured: Boolean(getExpectedServerToken()),
  });
}

/**
 * Verifies a Sanity API Write Token strictly on the server before issuing an
 * HttpOnly, SameSite=Strict session cookie. No hardcoded passwords or client-side bypasses exist.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const rate = checkRateLimit(`admin-auth:${ip}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many authentication attempts. Please wait 60 seconds.' },
      { status: 429 }
    );
  }

  const expectedToken = getExpectedServerToken();
  if (!expectedToken) {
    return NextResponse.json(
      {
        error:
          'SANITY_API_WRITE_TOKEN is not set on the server. Manage content directly in Sanity Studio or set SANITY_API_WRITE_TOKEN in .env.local.',
      },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const suppliedToken = typeof body?.token === 'string' ? body.token.trim() : '';

  if (!suppliedToken || suppliedToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Invalid Sanity API Write Token. Access denied.' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ authenticated: true, studioUrl: SANITY_STUDIO_URL });
  res.cookies.set(ADMIN_COOKIE_NAME, expectedToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}


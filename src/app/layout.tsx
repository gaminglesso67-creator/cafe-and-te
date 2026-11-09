import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { CartProvider } from '@/lib/cart-context';
import { t } from '@/lib/content';

const headingFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-heading',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0F0F10',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: `${t('brand.wordmark')} — ${t('brand.tagline')}`,
    template: `%s | ${t('brand.wordmark')}`,
  },
  description: t('home.hero.tagline'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${t('brand.wordmark')} — ${t('brand.tagline')}`,
    description: t('home.hero.tagline'),
    type: 'website',
    locale: 'en_IN',
    images: ['/placeholders/16x9.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${t('brand.wordmark')} — ${t('brand.tagline')}`,
    description: t('home.hero.tagline'),
    images: ['/placeholders/16x9.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-dvh bg-bg text-text antialiased flex flex-col">
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}


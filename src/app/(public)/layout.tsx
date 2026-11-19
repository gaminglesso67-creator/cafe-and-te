import React from 'react';
import dynamic from 'next/dynamic';
import {
  AnnouncementBar,
  Footer,
  Header,
  MobileBottomBar,
  WhatsAppFab,
} from '@/components/layout';
import { RestaurantSchemaMarkup } from '@/components/seo/SchemaMarkup';
import { AnalyticsTracker } from '@/components/seo/AnalyticsTracker';

// Lazy-load off-screen interactive overlays so they don't block initial hydration
const CartBottomSheet = dynamic(
  () => import('@/components/layout/CartBottomSheet').then((mod) => mod.CartBottomSheet),
  { ssr: false }
);

const ConsentBanner = dynamic(
  () => import('@/components/layout/ConsentBanner').then((mod) => mod.ConsentBanner),
  { ssr: false }
);

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col w-full overflow-x-clip">
      <RestaurantSchemaMarkup />
      <AnalyticsTracker />
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <MobileBottomBar />
      <WhatsAppFab />
      <CartBottomSheet />
      <ConsentBanner />
    </div>
  );
}


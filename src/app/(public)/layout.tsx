import React from 'react';
import {
  AnnouncementBar,
  CartBottomSheet,
  ConsentBanner,
  Footer,
  Header,
  MobileBottomBar,
  WhatsAppFab,
} from '@/components/layout';
import { RestaurantSchemaMarkup } from '@/components/seo/SchemaMarkup';
import { AnalyticsTracker } from '@/components/seo/AnalyticsTracker';

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


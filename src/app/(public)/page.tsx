import React from 'react';
import dynamic from 'next/dynamic';
import {
  HeroSignboardSection,
  SectionDataState,
  SignatureHighlightsSection,
} from '@/components/sections/HomeSections';
import { fetchSanityHomePageData } from '@/sanity/lib/fetchers';

// Lazy-load below-the-fold sections via next/dynamic code splitting
const HoursAndLocationSection = dynamic(
  () =>
    import('@/components/sections/HomeSections').then(
      (mod) => mod.HoursAndLocationSection
    ),
  { ssr: true }
);

const ReviewsTeaserSection = dynamic(
  () =>
    import('@/components/sections/HomeSections').then(
      (mod) => mod.ReviewsTeaserSection
    ),
  { ssr: true }
);

const OffersTeaserSection = dynamic(
  () =>
    import('@/components/sections/HomeSections').then(
      (mod) => mod.OffersTeaserSection
    ),
  { ssr: true }
);

const AboutTeaserSection = dynamic(
  () =>
    import('@/components/sections/HomeSections').then(
      (mod) => mod.AboutTeaserSection
    ),
  { ssr: true }
);

const GalleryTeaserSection = dynamic(
  () =>
    import('@/components/sections/HomeSections').then(
      (mod) => mod.GalleryTeaserSection
    ),
  { ssr: true }
);

const DualCtaBandSection = dynamic(
  () =>
    import('@/components/sections/HomeSections').then(
      (mod) => mod.DualCtaBandSection
    ),
  { ssr: true }
);

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { state?: string };
}) {
  const requestedState = searchParams?.state;
  const sectionState: SectionDataState =
    requestedState === 'loading' || requestedState === 'empty' || requestedState === 'error'
      ? requestedState
      : 'ready';

  const { hours, signatureDishes, offers, reviews, gallery } =
    await fetchSanityHomePageData();

  return (
    <>
      {/* Above-the-fold priority sections */}
      <HeroSignboardSection hours={hours} />
      <SignatureHighlightsSection items={signatureDishes} state={sectionState} />

      {/* Below-the-fold dynamically code-split & content-visibility deferred sections */}
      <div className="lazy-section">
        <HoursAndLocationSection hours={hours} state={sectionState} />
      </div>
      <div className="lazy-section">
        <ReviewsTeaserSection reviews={reviews} state={sectionState} />
      </div>
      <div className="lazy-section">
        <OffersTeaserSection offers={offers} state={sectionState} />
      </div>
      <div className="lazy-section">
        <AboutTeaserSection />
      </div>
      <div className="lazy-section">
        <GalleryTeaserSection items={gallery} state={sectionState} />
      </div>
      <div className="lazy-section">
        <DualCtaBandSection />
      </div>
    </>
  );
}


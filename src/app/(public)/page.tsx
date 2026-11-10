import React from 'react';
import {
  AboutTeaserSection,
  DualCtaBandSection,
  GalleryTeaserSection,
  HeroSignboardSection,
  HoursAndLocationSection,
  OffersTeaserSection,
  ReviewsTeaserSection,
  SectionDataState,
  SignatureHighlightsSection,
} from '@/components/sections/HomeSections';
import {
  SEED_GALLERY,
  SEED_MENU_ITEMS,
  SEED_OFFERS,
  SEED_OPENING_HOURS,
  SEED_REVIEWS,
} from '@/lib/seed-data';

export default function HomePage({
  searchParams,
}: {
  searchParams?: { state?: string };
}) {
  const requestedState = searchParams?.state;
  const sectionState: SectionDataState =
    requestedState === 'loading' || requestedState === 'empty' || requestedState === 'error'
      ? requestedState
      : 'ready';

  const signatureDishes = SEED_MENU_ITEMS.filter((item) => item.isSignature);

  return (
    <>
      <HeroSignboardSection hours={SEED_OPENING_HOURS} />
      <SignatureHighlightsSection items={signatureDishes} state={sectionState} />
      <HoursAndLocationSection hours={SEED_OPENING_HOURS} state={sectionState} />
      <ReviewsTeaserSection reviews={SEED_REVIEWS} state={sectionState} />
      <OffersTeaserSection offers={SEED_OFFERS} state={sectionState} />
      <AboutTeaserSection />
      <GalleryTeaserSection items={SEED_GALLERY} state={sectionState} />
      <DualCtaBandSection />
    </>
  );
}


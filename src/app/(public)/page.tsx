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
import { fetchSanityHomePageData } from '@/sanity/lib/fetchers';

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
      <HeroSignboardSection hours={hours} />
      <SignatureHighlightsSection items={signatureDishes} state={sectionState} />
      <HoursAndLocationSection hours={hours} state={sectionState} />
      <ReviewsTeaserSection reviews={reviews} state={sectionState} />
      <OffersTeaserSection offers={offers} state={sectionState} />
      <AboutTeaserSection />
      <GalleryTeaserSection items={gallery} state={sectionState} />
      <DualCtaBandSection />
    </>
  );
}


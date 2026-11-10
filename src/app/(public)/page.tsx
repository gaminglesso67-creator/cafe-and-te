import React from 'react';
import {
  AboutTeaserSection,
  GalleryTeaserSection,
  HeroSignboardSection,
  HoursAndLocationSection,
  ReviewsTeaserSection,
  SectionDataState,
  SignatureHighlightsSection,
} from '@/components/sections/HomeSections';
import {
  SEED_GALLERY,
  SEED_MENU_ITEMS,
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
      {/* 1. Full-Screen Nocturne Hero ("Where The City Whispers" -> "No Rush. Night Is Ours.") */}
      <HeroSignboardSection hours={SEED_OPENING_HOURS} />

      {/* 2. "Where Time Slows. And Senses Wake." + 4 Staggered Numbered Pillars (1, 2, 3, 4) */}
      <AboutTeaserSection />

      {/* 3. "The Ember Room" + Vertical Ritual List + BOOK A ROOM (→) */}
      <GalleryTeaserSection items={SEED_GALLERY} state={sectionState} />

      {/* 4. "Tonight's Special" + Hover-Reveal Plated Dish Portrait Cards + Chef's Secret Plate */}
      <SignatureHighlightsSection items={signatureDishes} state={sectionState} />

      {/* 5. "Book A Table" Culinary Flame Banner + 4-Column Horizontal Booking Bar */}
      <HoursAndLocationSection hours={SEED_OPENING_HOURS} state={sectionState} />

      {/* 6. "Real Experience" Editorial Split Portrait Testimonial Carousel */}
      <ReviewsTeaserSection reviews={SEED_REVIEWS} state={sectionState} />
    </>
  );
}

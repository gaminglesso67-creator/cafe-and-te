import React from 'react';
import { t } from '@/lib/content';
import { MenuCatalog } from '@/components/sections/MenuCatalog';
import { SectionDataState } from '@/components/sections/HomeSections';
import { GoldDivider, Section } from '@/components/ui';
import { fetchSanityMenuCatalog } from '@/sanity/lib/fetchers';

export default async function MenuPage({
  searchParams,
}: {
  searchParams?: { state?: string; cream?: string };
}) {
  const requestedState = searchParams?.state;
  const state: SectionDataState =
    requestedState === 'loading' || requestedState === 'empty' || requestedState === 'error'
      ? requestedState
      : 'ready';

  const { categories, items } = await fetchSanityMenuCatalog();

  return (
    <>
      <Section variant="surface" className="pt-10 pb-8 border-b border-gold/25">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {t('menu.header.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gold text-glow-gold">
            {t('menu.header.heading')}
          </h1>
          <p className="text-base text-muted">{t('menu.header.subtext')}</p>
        </div>
      </Section>
      <GoldDivider ornament={false} />
      <MenuCatalog
        categories={categories}
        items={items}
        defaultCreamSurface={searchParams?.cream === '1'}
        state={state}
      />
    </>
  );
}


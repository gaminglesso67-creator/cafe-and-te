import { Section } from '@/components/ui';
import { t } from '@/lib/content';

export default function RootPlaceholderPage() {
  return (
    <Section variant="dark">
      <h1 className="font-serif text-4xl text-glow-gold">{t('brand.wordmark')}</h1>
    </Section>
  );
}


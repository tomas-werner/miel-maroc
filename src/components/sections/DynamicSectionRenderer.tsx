'use client';

import { Locale } from '@/lib/utils/translations';
import ShopifyHero from './ShopifyHero';
import ShopifyTrustBadges from './ShopifyTrustBadges';
import ShopifyFeaturedProducts from './ShopifyFeaturedProducts';
import ShopifyImageBanner from './ShopifyImageBanner';

export interface SectionModel {
  id?: string;
  key: string;
  page?: string;
  title: string;
  type: string;
  position: number;
  isActive: boolean;
  content: any;
}

interface DynamicSectionRendererProps {
  sections: SectionModel[];
  locale: Locale;
}

export default function DynamicSectionRenderer({ sections, locale }: DynamicSectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  const activeSections = [...sections]
    .filter((s) => s.isActive)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="flex flex-col w-full">
      {activeSections.map((section) => {
        switch (section.type) {
          case 'HERO':
            return (
              <ShopifyHero
                key={section.id || section.key}
                data={section.content}
                locale={locale}
              />
            );
          case 'TRUST_BADGES':
            return (
              <ShopifyTrustBadges
                key={section.id || section.key}
                data={section.content}
                locale={locale}
              />
            );
          case 'FEATURED_COLLECTION':
            return (
              <ShopifyFeaturedProducts
                key={section.id || section.key}
                data={section.content}
                locale={locale}
              />
            );
          case 'IMAGE_BANNER':
            return (
              <ShopifyImageBanner
                key={section.id || section.key}
                data={section.content}
                locale={locale}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

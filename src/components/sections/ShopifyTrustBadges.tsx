'use client';

import { Locale } from '@/lib/utils/translations';
import { Truck, ShieldCheck, Leaf, Award, Star, Clock, Headphones } from 'lucide-react';

interface TrustBadgeItem {
  icon?: string;
  title_fr?: string;
  title_ar?: string;
  subtitle_fr?: string;
  subtitle_ar?: string;
}

interface ShopifyTrustBadgesProps {
  data: {
    items?: TrustBadgeItem[];
  };
  locale: Locale;
}

const iconMap: Record<string, React.ElementType> = {
  Truck,
  ShieldCheck,
  Leaf,
  Award,
  Star,
  Clock,
  Headphones,
};

export default function ShopifyTrustBadges({ data, locale }: ShopifyTrustBadgesProps) {
  const isRTL = locale === 'ar';
  const defaultItems: TrustBadgeItem[] = [
    {
      icon: 'Truck',
      title_fr: 'Livraison Express Partout au Maroc',
      subtitle_fr: 'En 24h à 48h (Offerte dès 300 MAD)',
      title_ar: 'توصيل سريع لكافة المدن',
      subtitle_ar: 'خلال 24 إلى 48 ساعة (مجاني فوق 300 د.م)',
    },
    {
      icon: 'ShieldCheck',
      title_fr: 'Paiement à la Livraison (COD)',
      subtitle_fr: 'Réglez en espèces à réception en toute sécurité',
      title_ar: 'الدفع عند الاستلام',
      subtitle_ar: 'ادفع نقداً عند استلام طلبيتك بكل أمان',
    },
    {
      icon: 'Leaf',
      title_fr: '100% Naturel & Analysé',
      subtitle_fr: 'Zéro sucre ajouté, sans aucun conservateur',
      title_ar: 'طبيعي 100% وخالٍ من الإضافات',
      subtitle_ar: 'خالٍ من السكر المضاف أو المواد الحافظة',
    },
    {
      icon: 'Award',
      title_fr: 'Qualité Terroir Supérieure',
      subtitle_fr: 'Origine certifiée des terroirs marocains',
      title_ar: 'جودة مغربية أصيلة',
      subtitle_ar: 'منتجات بلدية معتمدة من تعاونيات محلية',
    },
  ];

  const items = data.items && data.items.length > 0 ? data.items : defaultItems;

  return (
    <section className="bg-stone-50 border-y border-stone-200/80 py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => {
            const IconComponent = (item.icon && iconMap[item.icon]) || ShieldCheck;
            const title = isRTL ? item.title_ar : item.title_fr;
            const subtitle = isRTL ? item.subtitle_ar : item.subtitle_fr;

            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-200/60 shadow-xs hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                  <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

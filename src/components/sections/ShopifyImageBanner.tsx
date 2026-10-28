'use client';

import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { ArrowRight } from 'lucide-react';

interface ShopifyImageBannerProps {
  data: {
    title_fr?: string;
    title_ar?: string;
    description_fr?: string;
    description_ar?: string;
    buttonText_fr?: string;
    buttonText_ar?: string;
    buttonLink?: string;
    image?: string;
  };
  locale: Locale;
}

export default function ShopifyImageBanner({ data, locale }: ShopifyImageBannerProps) {
  const isRTL = locale === 'ar';
  const title = (isRTL ? data.title_ar : data.title_fr) || (isRTL ? "أصالة التراث وعراقة الطبيعة المغربية" : "L'Authenticité d'un Terroir Préservé");
  const description = (isRTL ? data.description_ar : data.description_fr) || (isRTL ? "نعمل بشراكة وثيقة مع مربي النحل في أعالي جبال الأطلس لنضمن لكم عسلاً حراً يحمل روح الطبيعة ونقاءها." : "Nos apiculteurs perpétuent un savoir-faire traditionnel au cœur des montagnes de l'Atlas pour vous offrir un nectar d'une pureté absolue.");
  const buttonText = (isRTL ? data.buttonText_ar : data.buttonText_fr) || (isRTL ? "قصتنا ومصادرنا" : "Découvrir Notre Histoire");
  const buttonLink = data.buttonLink ? `/${locale}${data.buttonLink}` : `/${locale}/a-propos`;
  const image = data.image || 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1600&q=80';

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-stone-900 text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl space-y-6">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
            {locale === 'fr' ? 'Artisanat & Pureté' : 'أصالة وجودة مضمونة'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            {description}
          </p>
          <div className="pt-2">
            <Link
              href={buttonLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm sm:text-base rounded-xl transition shadow-lg shadow-amber-600/30 group"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface ShopifyHeroProps {
  data: {
    title_fr?: string;
    title_ar?: string;
    subtitle_fr?: string;
    subtitle_ar?: string;
    buttonText_fr?: string;
    buttonText_ar?: string;
    buttonLink?: string;
    secondaryButtonText_fr?: string;
    secondaryButtonText_ar?: string;
    secondaryButtonLink?: string;
    badge_fr?: string;
    badge_ar?: string;
    backgroundImage?: string;
    mobileImage?: string;
    overlayOpacity?: number;
  };
  locale: Locale;
}

export default function ShopifyHero({ data, locale }: ShopifyHeroProps) {
  const isRTL = locale === 'ar';
  const title = (isRTL ? data.title_ar : data.title_fr) || (isRTL ? "عسل طبيعي نقي 100%" : "L'Excellence du Miel Pur");
  const subtitle = (isRTL ? data.subtitle_ar : data.subtitle_fr) || (isRTL ? "محصول طبيعي من أفضل المناحل المغربية" : "Récolté dans le respect des abeilles et des traditions.");
  const buttonText = (isRTL ? data.buttonText_ar : data.buttonText_fr) || (isRTL ? "اكتشف المجموعة" : "Découvrir la collection");
  const buttonLink = data.buttonLink ? `/${locale}${data.buttonLink}` : `/${locale}/catalogue`;
  const secondaryButtonText = isRTL ? data.secondaryButtonText_ar : data.secondaryButtonText_fr;
  const secondaryButtonLink = data.secondaryButtonLink ? `/${locale}${data.secondaryButtonLink}` : `/${locale}/a-propos`;
  const badge = isRTL ? data.badge_ar : data.badge_fr;
  const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 40;
  const bgImage = data.backgroundImage || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1920&q=80';

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white min-h-[520px] lg:min-h-[620px] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div
        className="absolute inset-0 bg-stone-950"
        style={{ opacity: overlayOpacity / 100 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

      {/* Content Container */}
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="max-w-2xl space-y-6">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-normal max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              href={buttonLink}
              className="px-7 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-600/30 hover:shadow-amber-500/50 flex items-center gap-2 group"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {secondaryButtonText && (
              <Link
                href={secondaryButtonLink}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base transition backdrop-blur-xs border border-white/20"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>

          {/* Micro trust badges */}
          <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-stone-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {locale === 'fr' ? '100% Brut & Analysé' : 'طبيعي خالص 100%'}
            </span>
            <span>•</span>
            <span>{locale === 'fr' ? 'Livraison Partout au Maroc' : 'توصيل لكافة المدن'}</span>
            <span>•</span>
            <span>{locale === 'fr' ? 'Paiement à la réception' : 'الدفع عند الاستلام'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

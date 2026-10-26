import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cairo } from "next/font/google";
import "../globals.css";
import { Locale, getDirection } from "@/lib/utils/translations";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/shared/WhatsAppFloatingButton";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === 'ar' ? 'ar' : 'fr') as Locale;
  const appName = locale === 'fr' ? 'Miel & Terroir Maroc' : 'متجر عسل وتراث المغرب';
  const description =
    locale === 'fr'
      ? 'Boutique en ligne spécialisée dans les miels purs du Maroc, l’huile d’argan bio, l’amlou artisanal et les produits d’exception. Livraison rapide partout au Maroc et paiement à la livraison.'
      : 'متجر مغربي متخصص في العسل الحر النقي، زيت أركان الطبيعي، أملو التقليدي والزعفران الأصيل. توصيل سريع لكافة المدن المغربية والدفع عند الاستلام.';

  return {
    title: {
      template: `%s | ${appName}`,
      default: appName,
    },
    description,
    keywords: [
      'miel maroc',
      'miel daghmous',
      'huile argan bio',
      'amlou amande',
      'safran taliouine',
      'e-commerce maroc',
      'عسل حر مغربي',
      'أملو',
      'زيت أركان',
    ],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === 'ar' ? 'ar' : 'fr') as Locale;
  const direction = getDirection(locale);

  return (
    <div dir={direction} className={`${jakarta.variable} ${cairo.variable} min-h-full flex flex-col`}>
      <Header locale={locale} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer locale={locale} />
      <WhatsAppFloatingButton locale={locale} />
      <MobileBottomNav locale={locale} />
    </div>
  );
}

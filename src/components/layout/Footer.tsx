'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle,
  CreditCard,
  Send,
} from 'lucide-react';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const isRTL = locale === 'ar';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-200 pt-16 pb-24 md:pb-12 border-t border-stone-800">
      {/* 1. REASSURANCE VALUE BAR (Morocco Specifics) */}
      <div className="container mx-auto px-4 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-800/40 border border-stone-700/50">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {locale === 'fr' ? 'Livraison Partout au Maroc' : 'توصيل لكافة مدن المملكة'}
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {locale === 'fr'
                  ? 'Casablanca, Rabat, Marrakech, Tanger et 50+ villes en 24-48h.'
                  : 'الدار البيضاء، الرباط، مراكش، طنجة وأكثر من 50 مدينة خلال 24-48 ساعة.'}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-800/40 border border-stone-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {locale === 'fr' ? 'Stock Propre & Authentique' : 'مخزون مضمون وأصلي 100%'}
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {locale === 'fr'
                  ? 'Miels et produits du terroir directement récoltés, sans intermédiaire.'
                  : 'عسل حر ومنتجات مجالية نقية مباشرة من المناحل المغربية بدون وسيط.'}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-800/40 border border-stone-700/50">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {locale === 'fr' ? 'Paiement à la Livraison' : 'الدفع عند الاستلام (COD)'}
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {locale === 'fr'
                  ? 'Réglez en espèces à la réception de votre commande ou par carte sécurisée.'
                  : 'ادفع نقداً عند معاينة واستلام طلبيتك أو بأمان عبر البطاقة البنكية.'}
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-800/40 border border-stone-700/50">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {locale === 'fr' ? 'Service Client 7j/7' : 'خدمة العملاء 7 أيام/7'}
              </h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                {locale === 'fr'
                  ? 'Assistance et commande directes sur WhatsApp en Darija et Français.'
                  : 'فريق عمل مغربي رهن إشارتكم عبر واتساب لجميع الطلبات والاستفسارات.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NEWSLETTER & MAIN LINKS */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍯</span>
              <span className="text-xl font-black text-white tracking-tight">
                MIEL & TERROIR
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                MAROC
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              {locale === 'fr'
                ? 'Notre boutique rassemble le meilleur du terroir marocain : miels purs de montagne, huile d’argan certifiée, amlou artisanal et safran pur. Un stock rigoureusement contrôlé pour garantir pureté et fraîcheur à votre table.'
                : 'متجرنا يجمع أرقى منتجات التراث المغربي: عسل جبلي نقي، زيت أركان معتمد، أملو تقليدي وزعفران حر. مخزوننا الخاص يضمن لكم الجودة العالية والأصالة مع كل طلبية.'}
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-stone-200 mb-2">
                {locale === 'fr'
                  ? '🎁 Recevez -10% sur votre première commande :'
                  : '🎁 احصل على خصم 10% على أول طلبية لك:'}
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={
                    locale === 'fr' ? 'Votre adresse email...' : 'بريدك الإلكتروني...'
                  }
                  className="flex-1 bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-amber-500"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'S’inscrire' : 'اشتراك'}</span>
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {locale === 'fr'
                    ? 'Merci ! Utilisez le code promo MAROC10 lors de votre commande.'
                    : 'شكراً لك! استخدم رمز التخفيض MAROC10 عند إتمام الطلب.'}
                </p>
              )}
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              {locale === 'fr' ? 'Nos Rayons' : 'أقسام المتجر'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href={`/${locale}/catalogue?category=miel`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Miels Rares (Daghmous, Thym)' : 'عسل طبيعي (دغموس، زعتر)'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalogue?category=argan`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Huile d’Argan Cosmétique & Bio' : 'زيت أركان تجميلي وغذائي'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalogue?category=amlou`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Amlou aux Amandes Beldi' : 'أملو باللوز البلدي'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalogue?category=safran`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Safran Pur de Taliouine' : 'زعفران تاليوين الأصيل'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/catalogue?category=packs`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Coffrets Cadeaux & Packs Famille' : 'باقات وصناديق الهدايا'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              {locale === 'fr' ? 'Service Client' : 'خدمة الزبناء'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href={`/${locale}/livraison`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Zones de Livraison & Tarifs' : 'مناطق التوصيل والأسعار'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Foire Aux Questions (FAQ)' : 'الأسئلة المتكررة'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/retours-remboursements`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Retours & Remboursements' : 'سياسة الإرجاع والاستبدال'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Contactez-nous' : 'تواصل معنا'}
                </Link>
              </li>
              <li>
                <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                  {locale === 'fr' ? 'Commander sur WhatsApp' : 'الطلب السريع عبر واتساب'}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              {locale === 'fr' ? 'Informations Légales' : 'معلومات قانونية'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href={`/${locale}/conditions-generales`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Conditions Générales de Vente' : 'الشروط العامة للبيع'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/confidentialite`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Politique de Confidentialité' : 'سياسة الخصوصية'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/mentions-legales`} className="hover:text-amber-400 transition">
                  {locale === 'fr' ? 'Mentions Légales' : 'الإشعار القانوني'}
                </Link>
              </li>
              <li>
                <Link href="/admin/connexion" className="text-stone-600 hover:text-stone-400 transition">
                  {locale === 'fr' ? 'Espace Administration' : 'لوحة الإدارة'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. PAYMENT BADGES & COPYRIGHT */}
      <div className="container mx-auto px-4 pt-8 border-t border-stone-800 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} Miel Boutique Maroc. {locale === 'fr' ? 'Tous droits réservés.' : 'جميع الحقوق محفوظة.'}
        </p>

        {/* Payment and Delivery Partners */}
        <div className="flex items-center gap-3 flex-wrap justify-center text-[11px] text-stone-400">
          <span className="font-medium text-stone-300">
            {locale === 'fr' ? 'Paiement & Transport :' : 'الدفع والشحن:'}
          </span>
          <span className="bg-stone-800 px-2 py-1 rounded text-stone-300 font-semibold border border-stone-700">
            💵 Cash on Delivery (COD)
          </span>
          <span className="bg-stone-800 px-2 py-1 rounded text-stone-300 font-semibold border border-stone-700">
            💳 CMI / Cartes Bancaires
          </span>
          <span className="bg-stone-800 px-2 py-1 rounded text-stone-300 font-semibold border border-stone-700">
            🚚 Amana / CTM
          </span>
        </div>
      </div>
    </footer>
  );
}

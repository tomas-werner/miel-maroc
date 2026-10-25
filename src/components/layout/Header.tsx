'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/lib/utils/translations';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Truck,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Flame,
  ShieldCheck,
  PhoneCall,
  Check,
} from 'lucide-react';
import { useCart } from '@/lib/store/cart';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems, getTotalPrice } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const isRTL = locale === 'ar';
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const switchLocale = (newLocale: Locale) => {
    // If current path starts with /fr or /ar, replace it
    const segments = pathname.split('/');
    if (segments[1] === 'fr' || segments[1] === 'ar') {
      segments[1] = newLocale;
      return segments.join('/') || `/${newLocale}`;
    }
    return `/${newLocale}${pathname}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingTags = [
    { label: locale === 'fr' ? 'Miel de Daghmous' : 'عسل الدغموس', query: 'daghmous' },
    { label: locale === 'fr' ? 'Huile d’Argan Pure' : 'زيت أركان نقي', query: 'argan' },
    { label: locale === 'fr' ? 'Amlou aux Amandes' : 'أملو باللوز', query: 'amlou' },
    { label: locale === 'fr' ? 'Safran Taliouine' : 'زعفران تاليوين', query: 'safran' },
    { label: locale === 'fr' ? 'Packs Cadeaux' : 'باقات الهدايا', query: 'pack' },
  ];

  const categories = [
    {
      id: 'miel',
      name: locale === 'fr' ? 'Miels Rares & Terroir' : 'أنواع العسل النادرة',
      desc: locale === 'fr' ? 'Daghmous, Thym, Oranger, Sidr' : 'الدغموس، السدر، الزعتر، الليمون',
      icon: '🍯',
      href: `/${locale}/catalogue?category=miel`,
    },
    {
      id: 'argan',
      name: locale === 'fr' ? 'Huile d’Argan & Soins' : 'زيت أركان والعناية',
      desc: locale === 'fr' ? '100% Bio Cosmétique & Culinaire' : 'طبيعي 100% للتجميل والتغذية',
      icon: '🌿',
      href: `/${locale}/catalogue?category=argan`,
    },
    {
      id: 'amlou',
      name: locale === 'fr' ? 'Amlou Artisanal' : 'أملو تقليدي بالأركان',
      desc: locale === 'fr' ? 'Amandes beldi & miel d’oranger' : 'لوز بلدي وعسل الليمون',
      icon: '🌰',
      href: `/${locale}/catalogue?category=amlou`,
    },
    {
      id: 'safran',
      name: locale === 'fr' ? 'Safran Pur & Épices' : 'زعفران خالص وتوابل',
      desc: locale === 'fr' ? 'Appellation d’Origine Taliouine' : 'زعفران تاليوين الأصيل',
      icon: '🌸',
      href: `/${locale}/catalogue?category=safran`,
    },
    {
      id: 'packs',
      name: locale === 'fr' ? 'Coffrets & Cadeaux' : 'صناديق وباقات هدايا',
      desc: locale === 'fr' ? 'Assortiments dégustation prestige' : 'تشكيلات فاخرة للمناسبات',
      icon: '🎁',
      href: `/${locale}/catalogue?category=packs`,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200/80 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT TICKER (SHEIN Style) */}
      <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4 border-b border-stone-800">
        <div className="container mx-auto flex items-center justify-between">
          {/* Ticker / Promo message */}
          <div className="flex items-center gap-3 overflow-hidden text-[12px]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[11px] uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {locale === 'fr' ? 'Offre Spéciale' : 'عرض خاص'}
            </span>
            <p className="truncate text-stone-200 font-medium">
              {locale === 'fr'
                ? '🚚 Livraison OFFERTE partout au Maroc dès 300 MAD • Paiement à la livraison disponible (COD) !'
                : '🚚 توصيل مجاني لكافة مدن المغرب للطلبات فوق 300 د.م • الدفع عند الاستلام متاح!'}
            </p>
          </div>

          {/* Right helper links & Language Switcher */}
          <div className="hidden lg:flex items-center gap-5 text-stone-300">
            <Link
              href={`/${locale}/livraison`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Suivi & Zones desservies' : 'تتبع الطلبات والشحن'}</span>
            </Link>

            <span className="w-px h-3.5 bg-stone-700" />

            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition text-emerald-400 font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Aide WhatsApp 7j/7' : 'مساعدة واتساب 7/7'}</span>
            </a>

            <span className="w-px h-3.5 bg-stone-700" />

            {/* Language Selector Pill */}
            <div className="flex items-center bg-stone-800/80 p-0.5 rounded-full border border-stone-700">
              <Link
                href={switchLocale('fr')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition ${
                  locale === 'fr'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                FR
              </Link>
              <Link
                href={switchLocale('ar')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition ${
                  locale === 'ar'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                العربية
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-amber-600 hover:bg-stone-100 rounded-lg transition"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition duration-300">
              <span className="text-xl font-bold">🍯</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-stone-900 group-hover:text-amber-700 transition">
                  MIEL
                </span>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                  MAROC
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium -mt-1 tracking-tight">
                {locale === 'fr' ? 'Terroir & Ruches Authentiques' : 'أصالة العسل المغربي الحر'}
              </span>
            </div>
          </Link>

          {/* Central Search Bar (Inspiré Alibaba & SHEIN) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto flex-col gap-1.5">
            <form onSubmit={handleSearchSubmit} className="relative flex w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    locale === 'fr'
                      ? 'Rechercher un miel rare, argan pur, amlou, safran...'
                      : 'ابحث عن عسل الدغموس، زيت أركان، أملو، زعفران...'
                  }
                  className={`w-full h-11 bg-stone-100/80 border border-stone-300 rounded-s-xl focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm text-stone-900 placeholder-stone-400 transition-all outline-none ${
                    isRTL ? 'pr-11 pl-4 rounded-s-xl' : 'pl-11 pr-4 rounded-s-xl'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <Search
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 ${
                    isRTL ? 'right-4' : 'left-4'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="h-11 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm rounded-e-xl shadow-xs hover:shadow-md transition flex items-center gap-2 flex-shrink-0"
              >
                <span>{locale === 'fr' ? 'Trouver' : 'بحث'}</span>
              </button>
            </form>

            {/* Trending Search Tags */}
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-stone-500 pt-0.5">
              <span className="font-semibold text-amber-700 flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {locale === 'fr' ? 'Tendances :' : 'الأكثر طلباً:'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {trendingTags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={`/${locale}/catalogue?search=${tag.query}`}
                    className="hover:text-amber-700 hover:underline transition"
                  >
                    {tag.label}
                    {idx < trendingTags.length - 1 && <span className="text-stone-300 ms-1.5">•</span>}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Icons (Compte, Favoris, Panier) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Language toggle on mobile */}
            <Link
              href={switchLocale(locale === 'fr' ? 'ar' : 'fr')}
              className="lg:hidden px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-100 text-stone-700 hover:bg-amber-100 transition"
            >
              {locale === 'fr' ? 'العربية' : 'FR'}
            </Link>

            {/* Mon Compte */}
            <Link
              href={`/${locale}/connexion`}
              className="hidden sm:flex items-center gap-2 p-2 rounded-xl text-stone-700 hover:text-amber-600 hover:bg-stone-50 transition"
            >
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                <User className="w-5 h-5" />
              </div>
              <div className="hidden xl:flex flex-col text-start">
                <span className="text-[10px] text-stone-400 font-medium leading-none">
                  {locale === 'fr' ? 'Bienvenue' : 'مرحباً'}
                </span>
                <span className="text-xs font-semibold text-stone-800 leading-tight">
                  {locale === 'fr' ? 'Mon Compte' : 'حسابي'}
                </span>
              </div>
            </Link>

            {/* Favoris */}
            <Link
              href={`/${locale}/catalogue`}
              className="hidden sm:flex p-2 rounded-xl text-stone-700 hover:text-amber-600 hover:bg-stone-50 transition relative"
              aria-label="Favoris"
            >
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                <Heart className="w-5 h-5" />
              </div>
            </Link>

            {/* Panier d'achat avec total MAD et compteur badge */}
            <Link
              href={`/${locale}/panier`}
              className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 transition group relative"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white animate-bounce">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-start pe-1">
                <span className="text-[10px] text-amber-700 font-medium leading-none">
                  {locale === 'fr' ? 'Mon Panier' : 'سلة الشراء'}
                </span>
                <span className="text-xs font-bold text-stone-900 leading-tight">
                  {totalPrice.toFixed(0)} MAD
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. CATEGORIES NAVIGATION BAR (Alibaba Mega-menu Inspired) */}
      <div className="hidden lg:block border-t border-stone-200 bg-stone-50/70">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mega-menu categories dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs tracking-wide uppercase px-5 py-3 transition shadow-xs"
              >
                <Menu className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Tous nos Rayons' : 'جميع الأقسام'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega-menu dropdown list */}
              {categoryDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                  className={`absolute top-full z-50 w-80 bg-white rounded-b-2xl shadow-2xl border border-stone-200 p-3 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isRTL ? 'right-0' : 'left-0'
                  }`}
                >
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition">
                          {cat.icon}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-stone-900 group-hover:text-amber-700">
                            {cat.name}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">{cat.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-semibold px-2">
                    <Link
                      href={`/${locale}/catalogue`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{locale === 'fr' ? 'Voir tout le catalogue →' : 'تصفح كل المنتجات ←'}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Horizontal Navigation Links */}
            <nav className="flex items-center gap-6 text-xs font-semibold text-stone-700">
              <Link
                href={`/${locale}`}
                className={`py-3 hover:text-amber-600 transition flex items-center gap-1.5 ${
                  pathname === `/${locale}` ? 'text-amber-600 border-b-2 border-amber-600' : ''
                }`}
              >
                <span>{locale === 'fr' ? 'Accueil' : 'الرئيسية'}</span>
              </Link>

              <Link
                href={`/${locale}/catalogue`}
                className="py-3 hover:text-amber-600 transition flex items-center gap-1.5"
              >
                <span>{locale === 'fr' ? 'Catalogue Général' : 'الكتالوج العام'}</span>
              </Link>

              <Link
                href={`/${locale}#flash-deals`}
                className="py-3 text-rose-600 hover:text-rose-700 transition flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
                <span>{locale === 'fr' ? 'Ventes Flash 🔥' : 'عروض فورية 🔥'}</span>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  -40%
                </span>
              </Link>

              <Link
                href={`/${locale}/catalogue?category=packs`}
                className="py-3 hover:text-amber-600 transition flex items-center gap-1.5"
              >
                <span>{locale === 'fr' ? 'Packs & Coffrets 🎁' : 'الباقات الفاخرة 🎁'}</span>
              </Link>

              <Link
                href={`/${locale}/a-propos`}
                className="py-3 hover:text-amber-600 transition"
              >
                <span>{locale === 'fr' ? 'Notre Histoire & Terroir' : 'قصتنا وأصالتنا'}</span>
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="py-3 hover:text-amber-600 transition"
              >
                <span>{locale === 'fr' ? 'Contact' : 'اتصل بنا'}</span>
              </Link>
            </nav>

            {/* Reassurance badge right side */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {locale === 'fr' ? 'Stock Propre & Contrôlé 🇲🇦' : 'مخزون خاص وجودة معتمدة 🇲🇦'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <span className="text-lg font-black text-amber-700">
                  {locale === 'fr' ? 'Menu de navigation' : 'قائمة التصفح'}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <form onSubmit={handleSearchSubmit} className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      locale === 'fr'
                        ? 'Rechercher un produit...'
                        : 'ابحث عن منتج...'
                    }
                    className="w-full h-10 px-4 pl-10 bg-stone-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </form>

              {/* Rayons & Categories */}
              <div className="mt-6">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  {locale === 'fr' ? 'Nos Rayons' : 'الأقسام الرئيسية'}
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-stone-800 font-medium text-sm transition"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Secondary Links */}
              <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
                <Link
                  href={`/${locale}/catalogue`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 text-stone-700 font-medium text-sm hover:text-amber-600"
                >
                  {locale === 'fr' ? 'Tous les produits' : 'كل المنتجات'}
                </Link>
                <Link
                  href={`/${locale}/livraison`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 text-stone-700 font-medium text-sm hover:text-amber-600"
                >
                  {locale === 'fr' ? 'Zones de Livraison & Délais' : 'مناطق التوصيل والمدة'}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 text-stone-700 font-medium text-sm hover:text-amber-600"
                >
                  {locale === 'fr' ? 'Contact & Assistance' : 'الاتصال والدعم'}
                </Link>
              </div>
            </div>

            {/* Bottom drawer footer */}
            <div className="pt-4 border-t border-stone-200">
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{locale === 'fr' ? 'WhatsApp Direct' : 'محادثة عبر واتساب'}</span>
              </a>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

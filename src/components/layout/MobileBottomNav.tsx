'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/utils/translations';
import { Home, Grid, Zap, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/lib/store/cart';

interface MobileBottomNavProps {
  locale: Locale;
}

export default function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const navItems = [
    {
      label: locale === 'fr' ? 'Accueil' : 'الرئيسية',
      href: `/${locale}`,
      icon: Home,
      exact: true,
    },
    {
      label: locale === 'fr' ? 'Rayons' : 'الأقسام',
      href: `/${locale}/catalogue`,
      icon: Grid,
      exact: false,
    },
    {
      label: locale === 'fr' ? 'Flash Deals' : 'عروض حصرية',
      href: `/${locale}#flash-deals`,
      icon: Zap,
      badge: '-40%',
      badgeColor: 'bg-rose-500',
    },
    {
      label: locale === 'fr' ? 'Panier' : 'السلة',
      href: `/${locale}/panier`,
      icon: ShoppingBag,
      count: totalItems,
    },
    {
      label: locale === 'fr' ? 'Mon Compte' : 'حسابي',
      href: `/${locale}/connexion`,
      icon: User,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-amber-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-amber-700 font-semibold'
                  : 'text-stone-500 hover:text-amber-600'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-600' : ''
                  }`}
                />

                {/* Counter Badge */}
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center animate-bounce">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}

                {/* Promo Badge */}
                {item.badge && (
                  <span
                    className={`absolute -top-2 -right-3 ${item.badgeColor} text-white text-[9px] font-bold px-1 py-0.2 rounded-full uppercase`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 leading-none tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

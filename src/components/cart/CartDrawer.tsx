'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Locale } from '@/lib/utils/translations';
import { useCart } from '@/lib/store/cart';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CartDrawerProps {
  locale: Locale;
}

export default function CartDrawer({ locale }: CartDrawerProps) {
  const router = useRouter();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const isRTL = locale === 'ar';
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const freeShippingThreshold = 300;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const progressPercent = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex pl-10`}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* 1. DRAWER HEADER */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" strokeWidth={1.5} />
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {locale === 'fr' ? 'Votre Panier' : 'سلة مشترياتك'}
              </h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>

          {/* 2. FREE SHIPPING PROGRESS BAR */}
          <div className="px-5 py-3.5 bg-amber-50/60 border-b border-amber-200/60">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                {totalPrice >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {locale === 'fr'
                      ? 'Livraison offerte débloquée !'
                      : 'تهانينا! لقد حصلت على توصيل مجاني!'}
                  </span>
                ) : (
                  <span>
                    {locale === 'fr' ? (
                      <>
                        Plus que <strong className="text-amber-800">{remainingForFreeShipping.toFixed(0)} MAD</strong> pour la livraison offerte
                      </>
                    ) : (
                      <>
                        أضف ما قيمته <strong className="text-amber-800">{remainingForFreeShipping.toFixed(0)} د.م</strong> للحصول على شحن مجاني
                      </>
                    )}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-semibold text-stone-500">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  totalPrice >= freeShippingThreshold
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3. CART ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
                  <ShoppingBag className="w-10 h-10" strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    {locale === 'fr' ? 'Votre panier est vide' : 'سلتك فارغة حالياً'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xs">
                    {locale === 'fr'
                      ? 'Découvrez nos miels purs de terroirs marocains et commencez vos achats.'
                      : 'اكتشف مجموعتنا المختارة من العسل الطبيعي الحر وابدأ التسوق الآن.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeDrawer();
                    router.push(`/${locale}/catalogue`);
                  }}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition shadow-xs"
                >
                  {locale === 'fr' ? 'Découvrir nos miels' : 'استعراض المنتجات'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 pt-3 first:pt-0">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200 relative flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">🍯</span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                            {item.productName}
                          </h4>
                          {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <p className="text-xs text-stone-500">
                              {Object.entries(item.attributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(' • ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-stone-400 hover:text-rose-600 transition p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1.5 hover:bg-stone-100 text-stone-600 transition"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1.5 hover:bg-stone-100 text-stone-600 transition"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-end">
                          <span className="text-sm font-bold text-stone-900">
                            {(item.price * item.quantity).toFixed(0)} MAD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. DRAWER FOOTER (CHECKOUT & REASSURANCE) */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3.5">
              {/* Subtotal */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-stone-600">
                  {locale === 'fr' ? 'Sous-total estimé' : 'المجموع الفرعي'}
                </span>
                <span className="text-xl font-black text-stone-900">
                  {totalPrice.toFixed(0)} MAD
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {locale === 'fr'
                  ? 'Frais de livraison calculés à l’étape suivante. Paiement à la réception.'
                  : 'تكلفة الشحن تحتسب عند إتمام الطلب. الدفع نقداً عند الاستلام.'}
              </p>

              {/* Primary Checkout CTA Button */}
              <button
                onClick={() => {
                  closeDrawer();
                  router.push(`/${locale}/commande`);
                }}
                className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>{locale === 'fr' ? 'Commander maintenant' : 'إتمام الطلب الآن'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary View Cart Link */}
              <button
                onClick={() => {
                  closeDrawer();
                  router.push(`/${locale}/panier`);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-stone-700 hover:text-amber-700 hover:underline transition"
              >
                {locale === 'fr' ? 'Voir le panier complet' : 'عرض السلة الكاملة'}
              </button>

              {/* Reassurance Badge */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-center gap-4 text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {locale === 'fr' ? 'Paiement à la livraison' : 'الدفع عند الاستلام'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  {locale === 'fr' ? 'Livraison 24/48h' : 'توصيل في 24/48 ساعة'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

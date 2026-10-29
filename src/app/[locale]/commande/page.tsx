'use client';

import { useState, useEffect } from 'react';
import { Locale, t, getDirection } from '@/lib/utils/translations';
import { useCart } from '@/lib/store/cart';
import {
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Clock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { calculateShippingFee } from '@/lib/orders/store';

const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Fès',
  'Agadir',
  'Salé',
  'Kénitra',
  'Meknès',
  'Oujda',
  'Tétouan',
  'Mohammedia',
  'El Jadida',
  'Nador',
  'Béni Mellal',
  'Taza',
  'Essaouira',
  'Autre ville / Autre région',
];

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const [locale, setLocale] = useState<Locale>('fr');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      const loc = (resolvedParams.locale === 'ar' ? 'ar' : 'fr') as Locale;
      setLocale(loc);
      setIsRTL(getDirection(loc) === 'rtl');
    });
  }, [params]);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Casablanca',
    addressLine: '',
    deliveryInstructions: '',
    paymentMethod: 'CASH_ON_DELIVERY' as 'CASH_ON_DELIVERY' | 'ONLINE_CARD',
    promoCode: '',
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const subtotal = getTotalPrice();

  // 10% discount for promo MAROC10
  const discount = appliedPromo === 'MAROC10' ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = calculateShippingFee(formData.city, subtotal - discount);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyPromo = () => {
    setPromoError('');
    if (formData.promoCode.trim().toUpperCase() === 'MAROC10') {
      setAppliedPromo('MAROC10');
    } else if (formData.promoCode.trim()) {
      setPromoError(locale === 'fr' ? 'Code promo invalide' : 'رمز ترويجي غير صالح');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (items.length === 0) {
      setOrderError(locale === 'fr' ? 'Votre panier est vide' : 'سلة التسوق فارغة');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.fullName,
          guestPhone: formData.phone,
          guestEmail: formData.email,
          city: formData.city,
          addressLine: formData.addressLine,
          deliveryInstructions: formData.deliveryInstructions,
          paymentMethod: formData.paymentMethod,
          locale,
          promoCode: appliedPromo || undefined,
          items: items.map((i) => ({
            variantId: i.variantId,
            productId: i.productId,
            productName: i.productName,
            sku: i.sku,
            unitPrice: i.price,
            quantity: i.quantity,
            image: i.image,
            format: i.attributes?.format || i.attributes?.Poids || '500g',
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation de la commande');
      }

      setCompletedOrder(data.order);
      clearCart();
    } catch (err: any) {
      setOrderError(err.message || 'Impossible d’enregistrer la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp formatted confirmation URL
  const getWhatsAppConfirmationUrl = (order: any) => {
    const phone = '212600000000';
    const textFr = `Bonjour Miel Boutique ! Je confirme ma commande *${order.orderNumber}* :
- Client : ${order.guestName} (${order.guestPhone})
- Ville : ${order.shippingAddress?.city}
- Total : *${order.grandTotal} MAD* (Paiement à la livraison)
Merci de procéder à l'expédition !`;

    const textAr = `السلام عليكم متجر عسل المغرب! أؤكد طلبيتي رقم *${order.orderNumber}* :
- الاسم : ${order.guestName} (${order.guestPhone})
- المدينة : ${order.shippingAddress?.city}
- المجموع : *${order.grandTotal} د.م* (الدفع عند الاستلام)
يرجى تأكيد موعد الشحن. شكراً لكم!`;

    const message = encodeURIComponent(locale === 'fr' ? textFr : textAr);
    return `https://wa.me/${phone}?text=${message}`;
  };

  // Confirmation Success Screen
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200/80 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {locale === 'fr' ? 'Commande Confirmée !' : 'تم تأكيد طلبكم بنجاح!'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-3">
              {locale === 'fr' ? 'Merci pour votre commande' : 'شكراً لثقتكم بنا'}
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {locale === 'fr'
                ? `Numéro de commande : `
                : `رقم الطلبية : `}
              <strong className="text-stone-900 font-mono text-base">{completedOrder.orderNumber}</strong>
            </p>
          </div>

          {/* Details recap card */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70 text-start space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-stone-200/50">
              <span className="text-stone-500">{locale === 'fr' ? 'Destinataire' : 'المرسل إليه'}</span>
              <span className="font-bold text-stone-900">{completedOrder.guestName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200/50">
              <span className="text-stone-500">{locale === 'fr' ? 'Téléphone' : 'الهاتف'}</span>
              <span className="font-bold text-stone-900">{completedOrder.guestPhone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200/50">
              <span className="text-stone-500">{locale === 'fr' ? 'Ville & Adresse' : 'المدينة والعنوان'}</span>
              <span className="font-bold text-stone-900 text-end">
                {completedOrder.shippingAddress?.city}, {completedOrder.shippingAddress?.address}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200/50">
              <span className="text-stone-500">{locale === 'fr' ? 'Mode de paiement' : 'طريقة الدفع'}</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {locale === 'fr' ? 'Espèces à la livraison (COD)' : 'الدفع نقداً عند الاستلام'}
              </span>
            </div>
            <div className="flex justify-between py-1 pt-2 font-bold text-base text-stone-900">
              <span>{locale === 'fr' ? 'Montant Total' : 'المبلغ الإجمالي'}</span>
              <span className="text-amber-700">{completedOrder.grandTotal} MAD</span>
            </div>
          </div>

          {/* WhatsApp Direct Confirmation Button */}
          <div className="space-y-3 pt-2">
            <a
              href={getWhatsAppConfirmationUrl(completedOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
            >
              <span>{locale === 'fr' ? 'Recevoir le suivi par WhatsApp' : 'تتبع طلبي عبر واتساب'}</span>
            </a>

            <Link
              href={`/${locale}/catalogue`}
              className="inline-block text-xs font-bold text-stone-600 hover:text-amber-700 hover:underline pt-2"
            >
              {locale === 'fr' ? '← Continuer mes achats' : '← مواصلة التسوق'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl shadow-xs border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-stone-900">
            {locale === 'fr' ? 'Votre panier est vide' : 'سلة الشراء فارغة'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {locale === 'fr'
              ? 'Ajoutez des miels ou produits de nos terroirs pour passer commande.'
              : 'يرجى اختيار منتجات من المتجر لمواصلة عملية الطلب.'}
          </p>
          <Link
            href={`/${locale}/catalogue`}
            className="inline-block px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition"
          >
            {locale === 'fr' ? 'Découvrir nos produits' : 'تصفح المنتجات'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
            {locale === 'fr' ? 'Étape Finale' : 'المرحلة الأخيرة'}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 mt-2">
            {locale === 'fr' ? 'Finaliser votre Commande' : 'إتمام الطلب'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {locale === 'fr'
              ? 'Renseignez vos coordonnées de livraison. Paiement à la réception de votre colis.'
              : 'أدخل معلومات التوصيل. الدفع نقداً عند استلام طلبيتك.'}
          </p>
        </div>

        {orderError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold">
            {orderError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Details Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100 text-stone-900 font-bold text-base">
                  <User className="w-5 h-5 text-amber-600" />
                  <span>{locale === 'fr' ? '1. Coordonnées du Client' : '1. معلومات الاتصال'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {locale === 'fr' ? 'Nom et Prénom *' : 'الاسم الكامل *'}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Ex: Yassine El Amrani"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {locale === 'fr' ? 'Numéro de Téléphone (WhatsApp) *' : 'رقم الهاتف (واتساب) *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ex: 06 12 34 56 78"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'fr' ? 'Adresse E-mail (Optionnel)' : 'البريد الإلكتروني (اختياري)'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="client@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100 text-stone-900 font-bold text-base">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>{locale === 'fr' ? '2. Adresse de Livraison au Maroc' : '2. عنوان التوصيل بالمغرب'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {locale === 'fr' ? 'Ville *' : 'المدينة *'}
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    >
                      {MOROCCAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {locale === 'fr' ? 'Adresse exacte (Quartier, N°, Rue) *' : 'العنوان بالتفصيل (الحي، الزنقة، رقم المنزل) *'}
                    </label>
                    <input
                      type="text"
                      name="addressLine"
                      required
                      placeholder="Ex: Bd Zerktouni, Résidence Al Amal, Apt 4"
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'fr' ? 'Instructions pour le livreur (Optionnel)' : 'ملاحظات إضافية للموزع (اختيari)'}
                  </label>
                  <textarea
                    rows={2}
                    name="deliveryInstructions"
                    placeholder={
                      locale === 'fr'
                        ? 'Ex: Appeler avant de passer, livrer l’après-midi...'
                        : 'مثال: يرجى الاتصال قبل الوصول، التوصيل مساءً...'
                    }
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100 text-stone-900 font-bold text-base">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span>{locale === 'fr' ? '3. Mode de Règlement' : '3. طريقة الأداء'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                      formData.paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-amber-600 bg-amber-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                      className="mt-1 accent-amber-600"
                    />
                    <div>
                      <span className="block text-sm font-bold text-stone-900">
                        {locale === 'fr' ? 'Paiement à la Livraison' : 'الدفع عند الاستلام'}
                      </span>
                      <span className="block text-xs text-stone-500 mt-0.5">
                        {locale === 'fr'
                          ? 'Réglez en espèces à la réception de votre colis.'
                          : 'ادفع نقداً عند استلام طلبيتك من الموزع.'}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                      formData.paymentMethod === 'ONLINE_CARD'
                        ? 'border-amber-600 bg-amber-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE_CARD"
                      checked={formData.paymentMethod === 'ONLINE_CARD'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'ONLINE_CARD' })}
                      className="mt-1 accent-amber-600"
                    />
                    <div>
                      <span className="block text-sm font-bold text-stone-900">
                        {locale === 'fr' ? 'Carte Bancaire CMI' : 'بطاقة بنكية مغربية'}
                      </span>
                      <span className="block text-xs text-stone-500 mt-0.5">
                        {locale === 'fr'
                          ? 'Paiement sécurisé par carte marocaine ou internationale.'
                          : 'أداء آمن عبر البطاقة البنكية المغربية.'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Order Summary & Placement */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-black text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
                <span>{locale === 'fr' ? 'Récapitulatif de Commande' : 'ملخص الطلبية'}</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {items.reduce((s, i) => s + i.quantity, 0)} {locale === 'fr' ? 'articles' : 'منتجات'}
                </span>
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-stone-100 pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 pt-3 first:pt-0">
                    <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">🍯</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.productName}</p>
                      <p className="text-[11px] text-stone-500">
                        Quantité : {item.quantity} × {item.price} MAD
                      </p>
                      <p className="text-xs font-bold text-stone-900 mt-0.5">
                        {(item.price * item.quantity).toFixed(0)} MAD
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo code field */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="promoCode"
                    placeholder="Code Promo (ex: MAROC10)"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition"
                  >
                    Appliquer
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    ✓ Code {appliedPromo} appliqué (-10%)
                  </p>
                )}
                {promoError && <p className="text-xs text-rose-600 mt-1">{promoError}</p>}
              </div>

              {/* Totals Breakdown */}
              <div className="border-t border-stone-100 pt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>{locale === 'fr' ? 'Sous-total' : 'المجموع الفرعي'}</span>
                  <span className="font-bold text-stone-900">{subtotal.toFixed(0)} MAD</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{locale === 'fr' ? 'Réduction code promo' : 'خصم الرمز الترويجي'}</span>
                    <span>-{discount} MAD</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600 items-baseline">
                  <span>
                    {locale === 'fr' ? `Livraison (${formData.city})` : `التوصيل (${formData.city})`}
                  </span>
                  <span className="font-bold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-black">
                        {locale === 'fr' ? 'GRATUITE (Dès 300 MAD)' : 'مجاني (فوق 300 د.م)'}
                      </span>
                    ) : (
                      `${shippingFee} MAD`
                    )}
                  </span>
                </div>

                <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-black text-stone-900">
                    {locale === 'fr' ? 'Total à régler' : 'المجموع النهائي'}
                  </span>
                  <span className="text-2xl font-black text-amber-700">
                    {grandTotal.toFixed(0)} MAD
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{locale === 'fr' ? 'Validation en cours...' : 'جارٍ معالجة الطلب...'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {locale === 'fr' ? 'Confirmer la Commande' : 'تأكيد الطلب الآن'}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Reassurance pills */}
                <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {locale === 'fr' ? 'Paiement à la livraison' : 'الدفع عند الاستلام'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    {locale === 'fr' ? 'Livraison 24/48h' : 'توصيل سريع'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

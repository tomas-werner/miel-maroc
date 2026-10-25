'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { useCart } from '@/lib/store/cart';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  MessageCircle,
  Share2,
  Copy,
  Flame,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  Heart,
} from 'lucide-react';

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export interface ProductDetailData {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  categoryNameFr: string;
  categoryNameAr: string;
  categorySlug: string;
  basePrice: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  originFr: string;
  originAr: string;
  harvestFr: string;
  harvestAr: string;
  shortDescFr: string;
  shortDescAr: string;
  longDescFr: string;
  longDescAr: string;
  benefitsFr: string[];
  benefitsAr: string[];
  usageAdviceFr: string;
  usageAdviceAr: string;
  images: { url: string; altFr: string; altAr: string }[];
  variants: {
    id: string;
    sku: string;
    labelFr: string;
    labelAr: string;
    price: number;
    stock: number;
  }[];
}

interface ProductDetailClientProps {
  product: ProductDetailData;
  locale: Locale;
}

export default function ProductDetailClient({
  product,
  locale,
}: ProductDetailClientProps) {
  const isRTL = locale === 'ar';
  const { addItem } = useCart();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'benefits' | 'origin' | 'reviews'>('benefits');

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const currentPrice = currentVariant.price;
  const originalPrice = product.originalPrice;
  const discountPercent = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );

  const isLowStock = currentVariant.stock > 0 && currentVariant.stock <= 5;
  const isOutOfStock = currentVariant.stock <= 0;

  // Add to cart handler
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      productName: locale === 'fr' ? product.nameFr : product.nameAr,
      productSlug: product.slug,
      sku: currentVariant.sku,
      price: currentVariant.price,
      quantity,
      image: product.images[0]?.url,
      attributes: {
        format: locale === 'fr' ? currentVariant.labelFr : currentVariant.labelAr,
      },
    });

    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  };

  // Social sharing helpers (P0 Requirement)
  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://miel.ma/${locale}/produits/${product.slug}`;
  const shareTitle = locale === 'fr' ? product.nameFr : product.nameAr;
  const sharePrice = `${currentPrice} MAD`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    locale === 'fr'
      ? `Découvre "${shareTitle}" à ${sharePrice} sur Miel & Terroir Maroc :\n${productUrl}`
      : `اكتشف "${shareTitle}" بسعر ${sharePrice} على متجر عسل وتراث المغرب :\n${productUrl}`
  )}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    productUrl
  )}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${shareTitle} (${sharePrice})`
  )}&url=${encodeURIComponent(productUrl)}`;

  // WhatsApp 1-Click Order Link
  const whatsappOrderUrl = `https://wa.me/212600000000?text=${encodeURIComponent(
    locale === 'fr'
      ? `Salam ! Je souhaite commander :\n- Produit : ${shareTitle}\n- Format : ${currentVariant.labelFr}\n- Quantité : ${quantity}\n- Prix Total : ${currentPrice * quantity} MAD\n\nPaiement à la livraison au Maroc. Voici mon adresse :`
      : `السلام عليكم ! أرغب في تأكيد طلبي :\n- المنتج : ${shareTitle}\n- الحجم : ${currentVariant.labelAr}\n- الكمية : ${quantity}\n- المجموع : ${currentPrice * quantity} د.م\n\nالدفع عند الاستلام بالمغرب. عنواني هو :`
  )}`;

  return (
    <div className="bg-stone-50/50 min-h-screen py-6 sm:py-10">
      {/* 1. FLOATING ADD-TO-CART TOAST */}
      {addedToCartToast && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-stone-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/30 animate-in fade-in slide-in-from-top-4 duration-300 max-w-md">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-400">
              {locale === 'fr' ? 'Ajouté au panier !' : 'تمت الإضافة إلى السلة !'}
            </p>
            <p className="text-xs text-stone-200 truncate font-medium">
              {quantity}x {locale === 'fr' ? product.nameFr : product.nameAr} ({currentVariant.labelFr})
            </p>
          </div>
          <Link
            href={`/${locale}/panier`}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline flex-shrink-0"
          >
            {locale === 'fr' ? 'Voir le panier' : 'عرض السلة'}
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        {/* 2. BREADCRUMBS */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6 flex-wrap">
          <Link href={`/${locale}`} className="hover:text-amber-700 transition">
            {locale === 'fr' ? 'Accueil' : 'الرئيسية'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href={`/${locale}/catalogue`} className="hover:text-amber-700 transition">
            {locale === 'fr' ? 'Catalogue' : 'الكتالوج'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link
            href={`/${locale}/catalogue?category=${product.categorySlug}`}
            className="hover:text-amber-700 transition"
          >
            {locale === 'fr' ? product.categoryNameFr : product.categoryNameAr}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-semibold truncate max-w-xs sm:max-w-md">
            {locale === 'fr' ? product.nameFr : product.nameAr}
          </span>
        </nav>

        {/* 3. MAIN PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-stone-200/80">
          {/* LEFT: IMAGE GALLERY (SHEIN / 21st.dev Style) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60 group">
              <img
                src={product.images[selectedImageIdx]?.url}
                alt={
                  locale === 'fr'
                    ? product.images[selectedImageIdx]?.altFr
                    : product.images[selectedImageIdx]?.altAr
                }
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 cursor-zoom-in"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                    -{discountPercent}%
                  </span>
                )}
                <span className="bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  {locale === 'fr' ? 'Terroir Pur' : 'حر وأصيل'}
                </span>
              </div>

              {/* Region Pill */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-stone-800 shadow-md flex items-center gap-1.5 border border-stone-200">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{locale === 'fr' ? product.originFr : product.originAr}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIdx === idx
                        ? 'border-amber-600 shadow-md scale-102'
                        : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={locale === 'fr' ? img.altFr : img.altAr}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE CONTROLS */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Origin Line */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                  {locale === 'fr' ? product.categoryNameFr : product.categoryNameAr}
                </span>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-stone-900 font-bold">{product.rating}</span>
                  <span className="text-stone-400 font-medium">
                    ({product.reviewsCount} {locale === 'fr' ? 'avis vérifiés' : 'تقييم'})
                  </span>
                </div>
              </div>

              {/* Product Headline Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
                {locale === 'fr' ? product.nameFr : product.nameAr}
              </h1>

              {/* Short Description */}
              <p className="text-stone-600 text-sm leading-relaxed">
                {locale === 'fr' ? product.shortDescFr : product.shortDescAr}
              </p>

              {/* Pricing Line */}
              <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="text-3xl sm:text-4xl font-black text-amber-700">
                  {currentPrice} MAD
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {originalPrice} MAD
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {locale === 'fr' ? 'TTC • Prix Direct Terroir' : 'شامل الرسوم • سعر المنتج المباشر'}
                </span>
              </div>

              {/* Live Stock Status Indicator */}
              <div className="flex items-center gap-2 pt-1">
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    {locale === 'fr' ? 'Actuellement en rupture de stock' : 'نفد المخزون مؤقتاً'}
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    {locale === 'fr'
                      ? `Stock limité : plus que ${currentVariant.stock} pots disponibles !`
                      : `كمية محدودة : بقي ${currentVariant.stock} علب فقط في المخزون!`}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {locale === 'fr' ? 'En stock • Expédition sous 24h' : 'متوفر بالمخزون • شحن خلال 24 ساعة'}
                  </span>
                )}
              </div>

              {/* Variant Selector Pills */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    {locale === 'fr' ? 'Sélectionnez le format :' : 'اختر الحجم والوزن :'}
                  </label>
                  <span className="text-xs text-stone-500 font-mono">
                    SKU: {currentVariant.sku}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantIdx(idx);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedVariantIdx === idx
                          ? 'border-amber-600 bg-amber-50/80 text-amber-950 shadow-xs scale-102 ring-2 ring-amber-500/20'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>{locale === 'fr' ? v.labelFr : v.labelAr}</span>
                      <span className="ms-2 text-stone-500 font-semibold">
                        ({v.price} MAD)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="w-10 h-11 flex items-center justify-center text-stone-600 hover:text-amber-700 disabled:opacity-30 transition"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-black text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(currentVariant.stock, quantity + 1))
                      }
                      disabled={quantity >= currentVariant.stock || isOutOfStock}
                      className="w-10 h-11 flex items-center justify-center text-stone-600 hover:text-amber-700 disabled:opacity-30 transition"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 h-11 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {isOutOfStock
                        ? locale === 'fr'
                          ? 'Rupture'
                          : 'غير متوفر'
                        : locale === 'fr'
                        ? 'Ajouter au Panier'
                        : 'أضف إلى السلة'}
                    </span>
                  </button>
                </div>

                {/* 1-Click WhatsApp Direct Order Button (Moroccan High Conversion) */}
                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>
                    {locale === 'fr'
                      ? 'Commander en 1-Clic sur WhatsApp'
                      : 'طلب مباشر وفوري عبر واتساب'}
                  </span>
                </a>
              </div>

              {/* 4. SOCIAL SHARING (P0 Requirement) */}
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-stone-400" />
                    {locale === 'fr' ? 'Partager ce trésor :' : 'مشاركة المنتج :'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* WhatsApp */}
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
                      aria-label="Partager sur WhatsApp"
                      title="Partager sur WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-emerald-600" />
                    </a>

                    {/* Facebook */}
                    <a
                      href={facebookShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                      aria-label="Partager sur Facebook"
                      title="Partager sur Facebook"
                    >
                      <FacebookIcon />
                    </a>

                    {/* Twitter / X */}
                    <a
                      href={twitterShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition shadow-2xs"
                      aria-label="Partager sur X"
                      title="Partager sur X"
                    >
                      <TwitterIcon />
                    </a>

                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold transition"
                      title="Copier le lien"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">
                            {locale === 'fr' ? 'Copié !' : 'تم النسخ!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{locale === 'fr' ? 'Copier le lien' : 'نسخ الرابط'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. MOROCCAN TRUST & DELIVERY BOX */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-700">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <Truck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">
                    {locale === 'fr' ? 'Livraison 24h/48h' : 'توصيل 24/48 ساعة'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {locale === 'fr'
                      ? 'Casa, Rabat, Marrakech en 24h. Offerte dès 300 MAD.'
                      : 'الدار البيضاء والرباط 24 ساعة. مجاناً فوق 300 د.م.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">
                    {locale === 'fr' ? 'Paiement à la livraison' : 'الدفع عند الاستلام'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {locale === 'fr'
                      ? 'Réglez en espèces à la réception de votre colis.'
                      : 'ادفع نقداً عند استلام ومعاينة طلبيتك.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. TECHNICAL DETAILS, HERBAL BENEFITS & USAGE TABS */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200/80">
          {/* Tab Navigation */}
          <div className="flex items-center gap-3 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === 'benefits'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {locale === 'fr' ? '🌿 Bienfaits & Vertus' : '🌿 الفوائد والخصائص'}
            </button>
            <button
              onClick={() => setActiveTab('origin')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === 'origin'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {locale === 'fr' ? '🇲🇦 Origine & Récolte' : '🇲🇦 المصدر والجني'}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                activeTab === 'reviews'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {locale === 'fr'
                ? `⭐ Avis Clients (${product.reviewsCount})`
                : `⭐ تقييمات الزبناء (${product.reviewsCount})`}
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    {locale === 'fr' ? 'Description Détaillée' : 'الوصف الشامل'}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {locale === 'fr' ? product.longDescFr : product.longDescAr}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                    {locale === 'fr'
                      ? 'Principales Vertus Reconnues :'
                      : 'أبرز الفوائد الصحية الطبيعية :'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(locale === 'fr' ? product.benefitsFr : product.benefitsAr).map(
                      (b, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs font-semibold text-amber-950"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{b}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <span className="font-bold text-stone-900 block mb-1">
                    {locale === 'fr' ? 'Conseils de Dégustation :' : 'طريقة الاستعمال المثالية :'}
                  </span>
                  {locale === 'fr' ? product.usageAdviceFr : product.usageAdviceAr}
                </div>
              </div>
            )}

            {activeTab === 'origin' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {locale === 'fr' ? 'Région de Récolte' : 'منطقة الإنتاج'}
                  </p>
                  <p className="text-base font-black text-stone-900 mt-1">
                    {locale === 'fr' ? product.originFr : product.originAr}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {locale === 'fr' ? 'Période de Floraison' : 'موسم الجني'}
                  </p>
                  <p className="text-base font-black text-stone-900 mt-1">
                    {locale === 'fr' ? product.harvestFr : product.harvestAr}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {locale === 'fr' ? 'Contrôle & Traçabilité' : 'المراقبة والجودة'}
                  </p>
                  <p className="text-base font-black text-emerald-700 mt-1">
                    {locale === 'fr'
                      ? 'Analysé & Scellé (Stock Propre)'
                      : 'مفحوص ومضمون (مخزون خاص)'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                  <div className="text-center pe-4 border-e border-amber-200">
                    <p className="text-4xl font-black text-amber-700">{product.rating}</p>
                    <div className="flex items-center justify-center text-amber-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-500 font-semibold">
                      {product.reviewsCount} {locale === 'fr' ? 'avis' : 'تقييم'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {locale === 'fr' ? '100% Avis Clients Vérifiés' : '100% تقييمات حقيقية مؤكدة'}
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {locale === 'fr'
                        ? 'Tous les avis sont laissés par des clients ayant commandé et reçu leur produit au Maroc.'
                        : 'جميع الآراء من زبناء مغاربة قاموا باستلام وتجربة المنتج.'}
                    </p>
                  </div>
                </div>

                {/* Example Verified Reviews from Moroccan Buyers */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">Yassine B. (Casablanca)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          {locale === 'fr' ? 'Achat vérifié' : 'طلب مؤكد'}
                        </span>
                      </div>
                      <span className="text-stone-400 text-[11px]">Il y a 3 jours</span>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-stone-600">
                      {locale === 'fr'
                        ? 'Franchement le meilleur miel de Daghmous que j’ai goûté. Piquant naturel comme il faut, livré le lendemain matin à Casablanca. Merci pour le sérieux !'
                        : 'عسل ممتاز جداً وحر أصيل بالحرورة الطبيعية للدغموس، التوصيل في اليوم الموالي بالدار البيضاء. شكراً جزيلاً!'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">Khadija M. (Rabat)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          {locale === 'fr' ? 'Achat vérifié' : 'طلب مؤكد'}
                        </span>
                      </div>
                      <span className="text-stone-400 text-[11px]">Il y a 1 semaine</span>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-stone-600">
                      {locale === 'fr'
                        ? 'Emballage très soigné et pot bien protégé. Paiement effectué à la livraison en espèces. Je commanderai à nouveau le coffret pour ma famille.'
                        : 'تغليف ممتاز ومحكم، الدفع تم عند الاستلام نقداً. سأعيد الطلب بالتأكيد!'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. MOBILE STICKY BOTTOM BUY BAR (SHEIN High-Converting Pattern) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={product.images[0]?.url}
              alt=""
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-stone-200"
            />
            <div className="truncate">
              <p className="text-xs font-black text-amber-700 leading-tight">
                {currentPrice} MAD
              </p>
              <p className="text-[10px] text-stone-500 truncate">
                {currentVariant.labelFr}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs"
              aria-label="Commander par WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </a>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{locale === 'fr' ? 'Ajouter' : 'أضف للسلة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

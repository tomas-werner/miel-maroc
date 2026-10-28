'use client';

import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { TERROIR_PRODUCTS } from '@/lib/products/catalog';
import { useCart } from '@/lib/store/cart';
import { ShoppingBag, Star, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

interface ShopifyFeaturedProductsProps {
  data: {
    title_fr?: string;
    title_ar?: string;
    subtitle_fr?: string;
    subtitle_ar?: string;
    viewAllText_fr?: string;
    viewAllText_ar?: string;
    viewAllLink?: string;
    limit?: number;
  };
  locale: Locale;
}

export default function ShopifyFeaturedProducts({ data, locale }: ShopifyFeaturedProductsProps) {
  const isRTL = locale === 'ar';
  const { addItem, openDrawer } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  const title = (isRTL ? data.title_ar : data.title_fr) || (isRTL ? 'منتجاتنا الأكثر طلباً' : 'Nos Trésors de la Ruche les Plus Prisés');
  const subtitle = (isRTL ? data.subtitle_ar : data.subtitle_fr) || (isRTL ? 'تشكيلة مختارة من أندر وأجود أنواع العسل المغربي الطبيعي.' : 'Découvrez notre sélection des miels les plus purs et recherchés.');
  const viewAllText = (isRTL ? data.viewAllText_ar : data.viewAllText_fr) || (isRTL ? 'عرض كامل المنتجات' : 'Voir tout le catalogue');
  const viewAllLink = data.viewAllLink ? `/${locale}${data.viewAllLink}` : `/${locale}/catalogue`;
  const limit = data.limit || 4;

  const productsList = Object.values(TERROIR_PRODUCTS).slice(0, limit);

  const handleQuickAdd = (product: (typeof productsList)[0]) => {
    const defaultVariant = product.variants?.[0] || {
      id: `variant-${product.id}`,
      sku: `${product.slug}-500g`,
      price: product.basePrice,
      weight: '500g',
    };

    addItem({
      variantId: defaultVariant.id,
      productId: product.id,
      productName: isRTL ? product.nameAr : product.nameFr,
      productSlug: product.slug,
      sku: defaultVariant.sku,
      price: defaultVariant.price || product.basePrice,
      quantity: 1,
      image: product.images?.[0]?.url,
      attributes: { Poids: defaultVariant.weight || '500g' },
    });

    setAddedSlug(product.slug);
    setTimeout(() => {
      setAddedSlug(null);
    }, 2000);

    openDrawer();
  };

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
              {title}
            </h2>
            <p className="text-stone-500 text-sm sm:text-base mt-1.5 max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 hover:underline group"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsList.map((product) => {
            const isAdded = addedSlug === product.slug;
            const productName = isRTL ? product.nameAr : product.nameFr;
            const categoryName = isRTL ? product.categoryNameAr : product.categoryNameFr;
            const imgUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-stone-50/50 rounded-2xl border border-stone-200/80 p-4 hover:shadow-xl hover:border-amber-300 transition duration-300"
              >
                <div>
                  {/* Image container */}
                  <Link
                    href={`/${locale}/produits/${product.slug}`}
                    className="block relative aspect-square rounded-xl overflow-hidden bg-white mb-4"
                  >
                    <img
                      src={imgUrl}
                      alt={productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.originalPrice && product.originalPrice > product.basePrice && (
                      <span className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold shadow-xs">
                        -{Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </Link>

                  {/* Details */}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    {categoryName}
                  </span>
                  <Link
                    href={`/${locale}/produits/${product.slug}`}
                    className="block text-base font-bold text-stone-900 group-hover:text-amber-700 transition line-clamp-1 mt-1"
                  >
                    {productName}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-stone-500">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="font-semibold text-stone-700">{product.rating}</span>
                    <span>({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-lg font-black text-stone-900">
                      {product.basePrice} MAD
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-stone-400 line-through ms-2">
                        {product.originalPrice} MAD
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleQuickAdd(product)}
                    className={`p-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shadow-xs ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 hover:bg-amber-600 text-white'
                    }`}
                    aria-label="Ajouter au panier"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">{locale === 'fr' ? 'Ajouté' : 'تم'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span className="hidden sm:inline">{locale === 'fr' ? 'Ajouter' : 'أضف'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

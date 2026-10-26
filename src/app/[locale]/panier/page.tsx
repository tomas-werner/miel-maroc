'use client';

import { useState, useEffect } from 'react';
import { Locale, t, getDirection } from '@/lib/utils/translations';
import { useCart } from '@/lib/store/cart';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();
  const [locale, setLocale] = useState<Locale>('fr');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      const loc = resolvedParams.locale as Locale;
      setLocale(loc);
      setIsRTL(getDirection(loc) === 'rtl');
    });
  }, [params]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 MAD
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t(locale, 'cart.title')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t(locale, 'cart.empty')}
            </p>
            <Link
              href={`/${locale}/catalogue`}
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              {t(locale, 'cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t(locale, 'cart.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm p-6 flex gap-4"
              >
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <Link
                    href={`/${locale}/produits/${item.productSlug}`}
                    className="font-semibold text-gray-900 hover:text-amber-600 transition"
                  >
                    {item.productName}
                  </Link>
                  {item.attributes && (
                    <div className="text-sm text-gray-600 mt-1">
                      {Object.entries(item.attributes).map(([key, value]) => (
                        <span key={key}>
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
                  <p className="text-lg font-bold text-amber-600 mt-2">
                    {item.price.toFixed(2)} MAD
                  </p>
                </div>

                {/* Quantity & Remove */}
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-red-500 hover:text-red-600 transition"
                    title={t(locale, 'cart.remove')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} MAD
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">
                {t(locale, 'checkout.orderSummary')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t(locale, 'cart.subtotal')}
                  </span>
                  <span className="font-semibold">{subtotal.toFixed(2)} MAD</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t(locale, 'cart.shipping')}
                  </span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `${shipping.toFixed(2)} MAD`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-green-600">
                    Free shipping on orders over 500 MAD
                  </p>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">
                      {t(locale, 'cart.total')}
                    </span>
                    <span className="text-lg font-bold text-amber-600">
                      {total.toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/${locale}/commande`}
                className="block w-full bg-amber-600 text-white py-4 rounded-lg font-semibold text-center hover:bg-amber-700 transition"
              >
                {t(locale, 'cart.checkout')}
              </Link>

              <Link
                href={`/${locale}/catalogue`}
                className="block w-full mt-4 text-center text-gray-600 hover:text-amber-600 transition"
              >
                {t(locale, 'cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

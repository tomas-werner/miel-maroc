'use client';

import { useState, useEffect } from 'react';
import { Locale, t, getDirection } from '@/lib/utils/translations';
import { useCart } from '@/lib/store/cart';
import { Truck, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { items, getTotalPrice, clearCart } = useCart();
  const [locale, setLocale] = useState<Locale>('fr');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      const loc = resolvedParams.locale as Locale;
      setLocale(loc);
      setIsRTL(getDirection(loc) === 'rtl');
    });
  }, [params]);

  const [guestCheckout, setGuestCheckout] = useState(true);
  const [formData, setFormData] = useState({
    // Guest Info
    email: '',
    phone: '',
    firstName: '',
    lastName: '',

    // Shipping Address
    recipientName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    region: '',
    postalCode: '',
    deliveryInstructions: '',

    // Shipping Method
    shippingMethod: 'standard',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = getTotalPrice();
  const shippingCost = formData.shippingMethod === 'express' ? 80 : 50;
  const shippingCostFinal = subtotal > 500 ? 0 : shippingCost;
  const total = subtotal + shippingCostFinal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically:
    // 1. Validate the form
    // 2. Create the order via API
    // 3. Redirect to payment
    console.log('Checkout data:', formData);
    console.log('Cart items:', items);
    alert('Order submitted! (This is a demo)');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t(locale, 'checkout.title')}
            </h1>
            <p className="text-gray-600 mb-8">
              Your cart is empty
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
          {t(locale, 'checkout.title')}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest vs Account */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setGuestCheckout(true)}
                    className={`flex-1 py-3 rounded-lg font-medium transition ${
                      guestCheckout
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(locale, 'checkout.guestCheckout')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestCheckout(false)}
                    className={`flex-1 py-3 rounded-lg font-medium transition ${
                      !guestCheckout
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(locale, 'checkout.createAccount')}
                  </button>
                </div>

                {guestCheckout && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t(locale, 'auth.firstName')} *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t(locale, 'auth.lastName')} *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t(locale, 'auth.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t(locale, 'auth.phone')} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5" />
                  {t(locale, 'checkout.shippingAddress')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region *
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Instructions
                    </label>
                    <textarea
                      name="deliveryInstructions"
                      value={formData.deliveryInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5" />
                  {t(locale, 'checkout.shippingMethod')}
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-amber-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Standard Delivery</p>
                      <p className="text-sm text-gray-600">3-5 business days</p>
                    </div>
                    <p className="font-semibold">
                      {shippingCostFinal === 0 ? 'Free' : `${shippingCost} MAD`}
                    </p>
                  </label>
                  <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 transition">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-amber-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Express Delivery</p>
                      <p className="text-sm text-gray-600">1-2 business days</p>
                    </div>
                    <p className="font-semibold">
                      {shippingCostFinal === 0 ? 'Free' : `${shippingCost} MAD`}
                    </p>
                  </label>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-5 h-5 text-amber-600 rounded mt-0.5"
                  />
                  <span className="text-sm text-gray-600">
                    {t(locale, 'checkout.terms')}
                  </span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t(locale, 'checkout.orderSummary')}
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-sm">
                          {(item.price * item.quantity).toFixed(2)} MAD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-3">
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
                      {shippingCostFinal === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `${shippingCostFinal.toFixed(2)} MAD`
                      )}
                    </span>
                  </div>

                  {shippingCostFinal > 0 && (
                    <p className="text-sm text-green-600">
                      Free shipping on orders over 500 MAD
                    </p>
                  )}

                  <div className="border-t pt-3">
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

                <button
                  type="submit"
                  className="w-full mt-6 bg-amber-600 text-white py-4 rounded-lg font-semibold hover:bg-amber-700 transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {t(locale, 'checkout.placeOrder')}
                </button>

                <Link
                  href={`/${locale}/panier`}
                  className="block w-full mt-4 text-center text-gray-600 hover:text-amber-600 transition"
                >
                  {t(locale, 'common.back')}
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

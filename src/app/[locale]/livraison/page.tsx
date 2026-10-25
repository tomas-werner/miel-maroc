import { Locale, t } from '@/lib/utils/translations';
import { Metadata } from 'next';
import { Truck, Clock, CreditCard, MapPin } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const title = t(locale, 'pages.shipping.title');
  const description = t(locale, 'pages.shipping.subtitle');

  return {
    title,
    description,
  };
}

export default async function ShippingPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const isRTL = locale === 'ar';

  const zones = [
    {
      name: t(locale, 'pages.shipping.zones.casablanca.name'),
      time: t(locale, 'pages.shipping.zones.casablanca.deliveryTime'),
      cost: t(locale, 'pages.shipping.zones.casablanca.cost'),
    },
    {
      name: t(locale, 'pages.shipping.zones.rabat.name'),
      time: t(locale, 'pages.shipping.zones.rabat.deliveryTime'),
      cost: t(locale, 'pages.shipping.zones.rabat.cost'),
    },
    {
      name: t(locale, 'pages.shipping.zones.majorCities.name'),
      time: t(locale, 'pages.shipping.zones.majorCities.deliveryTime'),
      cost: t(locale, 'pages.shipping.zones.majorCities.cost'),
    },
    {
      name: t(locale, 'pages.shipping.zones.otherCities.name'),
      time: t(locale, 'pages.shipping.zones.otherCities.deliveryTime'),
      cost: t(locale, 'pages.shipping.zones.otherCities.cost'),
    },
    {
      name: t(locale, 'pages.shipping.zones.rural.name'),
      time: t(locale, 'pages.shipping.zones.rural.deliveryTime'),
      cost: t(locale, 'pages.shipping.zones.rural.cost'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t(locale, 'pages.shipping.title')}</h1>
          <p className="text-amber-100">{t(locale, 'pages.shipping.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Delivery Zones */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.shipping.zonesTitle')}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {locale === 'fr' ? 'Zone' : 'المنطقة'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {locale === 'fr' ? 'Délai de livraison' : 'وقت التوصيل'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      {locale === 'fr' ? 'Coût' : 'التكلفة'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-700">{zone.name}</td>
                      <td className="py-4 px-4 text-gray-700">{zone.time}</td>
                      <td className="py-4 px-4 text-gray-700">{zone.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Times */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.shipping.deliveryTimesTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.shipping.deliveryTimes')}
            </p>
          </div>

          {/* Shipping Costs */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.shipping.shippingCostsTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.shipping.shippingCosts')}
            </p>
          </div>

          {/* Order Tracking */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.shipping.trackingTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.shipping.tracking')}
            </p>
          </div>

          {/* Special Instructions */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t(locale, 'pages.shipping.specialInstructionsTitle')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t(locale, 'pages.shipping.specialInstructions')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

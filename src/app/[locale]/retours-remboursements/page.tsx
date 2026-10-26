import { Locale, t } from '@/lib/utils/translations';
import { Metadata } from 'next';
import { RotateCcw, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const title = t(locale, 'pages.returns.title');
  const description = t(locale, 'pages.returns.subtitle');

  return {
    title,
    description,
  };
}

export default async function ReturnsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const isRTL = locale === 'ar';

  const conditions = [
    t(locale, 'pages.returns.conditions.0'),
    t(locale, 'pages.returns.conditions.1'),
    t(locale, 'pages.returns.conditions.2'),
    t(locale, 'pages.returns.conditions.3'),
  ];

  const process = [
    t(locale, 'pages.returns.process.0'),
    t(locale, 'pages.returns.process.1'),
    t(locale, 'pages.returns.process.2'),
    t(locale, 'pages.returns.process.3'),
    t(locale, 'pages.returns.process.4'),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t(locale, 'pages.returns.title')}</h1>
          <p className="text-amber-100">{t(locale, 'pages.returns.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Return Policy */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <RotateCcw className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.returns.policyTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.returns.policy')}
            </p>
          </div>

          {/* Return Conditions */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.returns.conditionsTitle')}
              </h2>
            </div>
            <ul className="space-y-3">
              {conditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{condition}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.returns.processTitle')}
              </h2>
            </div>
            <div className="space-y-4">
              {process.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.returns.refundTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.returns.refund')}
            </p>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t(locale, 'pages.returns.exchangesTitle')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.returns.exchanges')}
            </p>
          </div>

          {/* Defective Products */}
          <div className="bg-red-50 rounded-lg border border-red-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t(locale, 'pages.returns.defectiveTitle')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t(locale, 'pages.returns.defective')}
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'fr'
                ? 'Besoin d\'aide pour un retour ?'
                : 'تحتاج مساعدة في الإرجاع؟'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'fr'
                ? 'Notre équipe est là pour vous accompagner.'
                : 'فريقنا هنا لمساعدتك.'}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              {t(locale, 'pages.contact.title')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

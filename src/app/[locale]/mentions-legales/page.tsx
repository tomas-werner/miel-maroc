import { Locale, t } from '@/lib/utils/translations';
import { Metadata } from 'next';
import { Building2, Server, User, Copyright, Shield } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const title = t(locale, 'pages.legal.title');
  const description = locale === 'fr'
    ? 'Mentions légales de Miel Boutique'
    : 'المعلومات القانونية لمتجر عسل';

  return {
    title,
    description,
  };
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t(locale, 'pages.legal.title')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Publisher Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.legal.publisherTitle')}
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="font-semibold">{t(locale, 'pages.legal.publisher.name')}</p>
              <p>{t(locale, 'pages.legal.publisher.form')}</p>
              <p>{t(locale, 'pages.legal.publisher.capital')}</p>
              <p>{t(locale, 'pages.legal.publisher.address')}</p>
              <p>{t(locale, 'pages.legal.publisher.phone')}</p>
              <p>{t(locale, 'pages.legal.publisher.email')}</p>
              <p>{t(locale, 'pages.legal.publisher.rc')}</p>
              <p>{t(locale, 'pages.legal.publisher.ice')}</p>
              <p>{t(locale, 'pages.legal.publisher.tax')}</p>
            </div>
          </div>

          {/* Hosting Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Server className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.legal.hostingTitle')}
              </h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>{t(locale, 'pages.legal.hosting.provider')}</p>
              <p>{t(locale, 'pages.legal.hosting.address')}</p>
            </div>
          </div>

          {/* Publication Director */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.legal.directorTitle')}
              </h2>
            </div>
            <p className="text-gray-700">{t(locale, 'pages.legal.director')}</p>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Copyright className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.legal.intellectualPropertyTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.legal.intellectualProperty')}
            </p>
          </div>

          {/* Personal Data Protection */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.legal.personalDataTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.legal.personalData')}
            </p>
          </div>

          {/* Consumer Law */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t(locale, 'pages.legal.consumerLawTitle')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t(locale, 'pages.legal.consumerLaw')}
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'fr'
                ? 'Besoin d\'informations supplémentaires ?'
                : 'تحتاج معلومات إضافية؟'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'fr'
                ? 'N\'hésitez pas à nous contacter pour toute question.'
                : 'لا تتردد في الاتصال بنا لأي سؤال.'}
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

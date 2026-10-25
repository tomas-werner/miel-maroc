import { Locale, t } from '@/lib/utils/translations';
import { Metadata } from 'next';
import { Shield, Database, Lock, User, Cookie, Eye } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const title = t(locale, 'pages.privacy.title');
  const description = locale === 'fr'
    ? 'Politique de confidentialité de Miel Boutique'
    : 'سياسة الخصوصية لمتجر عسل';

  return {
    title,
    description,
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const isRTL = locale === 'ar';

  const sections = [
    {
      icon: Database,
      title: t(locale, 'pages.privacy.collectionTitle'),
      content: t(locale, 'pages.privacy.collection'),
    },
    {
      icon: Eye,
      title: t(locale, 'pages.privacy.usageTitle'),
      content: t(locale, 'pages.privacy.usage'),
    },
    {
      icon: Database,
      title: t(locale, 'pages.privacy.sharingTitle'),
      content: t(locale, 'pages.privacy.sharing'),
    },
    {
      icon: Lock,
      title: t(locale, 'pages.privacy.securityTitle'),
      content: t(locale, 'pages.privacy.security'),
    },
    {
      icon: Cookie,
      title: t(locale, 'pages.privacy.cookiesTitle'),
      content: t(locale, 'pages.privacy.cookies'),
    },
    {
      icon: User,
      title: t(locale, 'pages.privacy.rightsTitle'),
      content: t(locale, 'pages.privacy.rights'),
    },
    {
      icon: Database,
      title: t(locale, 'pages.privacy.retentionTitle'),
      content: t(locale, 'pages.privacy.retention'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t(locale, 'pages.privacy.title')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'fr' ? 'Introduction' : 'مقدمة'}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.privacy.intro')}
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-8 bg-amber-50 rounded-lg border border-amber-200 p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'fr'
                ? 'Exercer vos droits'
                : 'ممارسة حقوقك'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'fr'
                ? 'Pour exercer vos droits ou poser des questions, contactez-nous.'
                : 'لممارسة حقوقك أو طرح الأسئلة، اتصل بنا.'}
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

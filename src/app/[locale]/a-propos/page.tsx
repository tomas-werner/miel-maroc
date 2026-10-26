import { Locale, t } from '@/lib/utils/translations';
import { Metadata } from 'next';
import { Heart, Target, Award, Users, Sparkles, Handshake } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const title = t(locale, 'pages.about.title');
  const description = t(locale, 'pages.about.subtitle');

  return {
    title,
    description,
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const isRTL = locale === 'ar';

  const values = [
    {
      name: t(locale, 'pages.about.values.0.name'),
      description: t(locale, 'pages.about.values.0.description'),
      icon: Award,
    },
    {
      name: t(locale, 'pages.about.values.1.name'),
      description: t(locale, 'pages.about.values.1.description'),
      icon: Sparkles,
    },
    {
      name: t(locale, 'pages.about.values.2.name'),
      description: t(locale, 'pages.about.values.2.description'),
      icon: Heart,
    },
    {
      name: t(locale, 'pages.about.values.3.name'),
      description: t(locale, 'pages.about.values.3.description'),
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t(locale, 'pages.about.title')}</h1>
          <p className="text-amber-100">{t(locale, 'pages.about.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Our Story */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.about.storyTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.about.story')}
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-md p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8" />
              <h2 className="text-2xl font-bold">
                {t(locale, 'pages.about.missionTitle')}
              </h2>
            </div>
            <p className="leading-relaxed">
              {t(locale, 'pages.about.mission')}
            </p>
          </div>

          {/* Our Values */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t(locale, 'pages.about.valuesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {value.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Our Team */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.about.teamTitle')}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.about.team')}
            </p>
          </div>

          {/* Our Commitment */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Handshake className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t(locale, 'pages.about.commitmentTitle')}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t(locale, 'pages.about.commitment')}
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">
              {locale === 'fr'
                ? 'Envie de collaborer avec nous ?'
                : 'ترغب في التعاون معنا؟'}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === 'fr'
                ? 'Nous serions ravis d\'échanger avec vous.'
                : 'نحن سعداء بالتبادل معك.'}
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

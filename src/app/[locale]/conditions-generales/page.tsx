import { Locale, t } from '@/lib/utils/translations';
import { Metadata } from 'next';
import { FileText, Scale } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const title = t(locale, 'pages.terms.title');
  const description = locale === 'fr'
    ? 'Conditions générales de vente de Miel Boutique'
    : 'شروط البيع لمتجر عسل';

  return {
    title,
    description,
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const isRTL = locale === 'ar';

  const articles = [
    {
      number: 1,
      title: t(locale, 'pages.terms.articles.1.title'),
      content: t(locale, 'pages.terms.articles.1.content'),
    },
    {
      number: 2,
      title: t(locale, 'pages.terms.articles.2.title'),
      content: t(locale, 'pages.terms.articles.2.content'),
    },
    {
      number: 3,
      title: t(locale, 'pages.terms.articles.3.title'),
      content: t(locale, 'pages.terms.articles.3.content'),
    },
    {
      number: 4,
      title: t(locale, 'pages.terms.articles.4.title'),
      content: t(locale, 'pages.terms.articles.4.content'),
    },
    {
      number: 5,
      title: t(locale, 'pages.terms.articles.5.title'),
      content: t(locale, 'pages.terms.articles.5.content'),
    },
    {
      number: 6,
      title: t(locale, 'pages.terms.articles.6.title'),
      content: t(locale, 'pages.terms.articles.6.content'),
    },
    {
      number: 7,
      title: t(locale, 'pages.terms.articles.7.title'),
      content: t(locale, 'pages.terms.articles.7.content'),
    },
    {
      number: 8,
      title: t(locale, 'pages.terms.articles.8.title'),
      content: t(locale, 'pages.terms.articles.8.content'),
    },
    {
      number: 9,
      title: t(locale, 'pages.terms.articles.9.title'),
      content: t(locale, 'pages.terms.articles.9.content'),
    },
    {
      number: 10,
      title: t(locale, 'pages.terms.articles.10.title'),
      content: t(locale, 'pages.terms.articles.10.content'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t(locale, 'pages.terms.title')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'fr' ? 'Introduction' : 'مقدمة'}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t(locale, 'pages.terms.intro')}
            </p>
          </div>

          {/* Articles */}
          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.number} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-lg">
                    {article.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 bg-amber-50 rounded-lg border border-amber-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-amber-600" />
              <h3 className="font-semibold text-gray-900">
                {locale === 'fr'
                  ? 'Dernière mise à jour'
                  : 'آخر تحديث'}
              </h3>
            </div>
            <p className="text-gray-700">
              {locale === 'fr'
                ? 'Ces conditions générales de vente sont mises à jour régulièrement. Nous vous invitons à les consulter régulièrement.'
                : 'يتم تحديث شروط البيع هذه بانتظام. ندعوك لمراجعتها بانتظام.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

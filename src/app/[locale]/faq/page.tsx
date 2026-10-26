import { Locale, t } from '@/lib/utils/translations';
import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const title = t(locale, 'pages.faq.title');
  const description = t(locale, 'pages.faq.subtitle');

  return {
    title,
    description,
  };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const isRTL = locale === 'ar';

  const faqs = [
    { q: t(locale, 'pages.faq.q1'), a: t(locale, 'pages.faq.a1') },
    { q: t(locale, 'pages.faq.q2'), a: t(locale, 'pages.faq.a2') },
    { q: t(locale, 'pages.faq.q3'), a: t(locale, 'pages.faq.a3') },
    { q: t(locale, 'pages.faq.q4'), a: t(locale, 'pages.faq.a4') },
    { q: t(locale, 'pages.faq.q5'), a: t(locale, 'pages.faq.a5') },
    { q: t(locale, 'pages.faq.q6'), a: t(locale, 'pages.faq.a6') },
    { q: t(locale, 'pages.faq.q7'), a: t(locale, 'pages.faq.a7') },
    { q: t(locale, 'pages.faq.q8'), a: t(locale, 'pages.faq.a8') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{t(locale, 'pages.faq.title')}</h1>
          <p className="text-amber-100">{t(locale, 'pages.faq.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'fr' ? 'Questions fréquentes' : 'الأسئلة المتكررة'}
              </h2>
            </div>

            <FAQAccordion faqs={faqs} isRTL={isRTL} />

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                {locale === 'fr'
                  ? "Vous ne trouvez pas votre réponse ?"
                  : 'لم تجد إجابتك؟'}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === 'fr'
                  ? 'N\'hésitez pas à nous contacter directement pour toute question supplémentaire.'
                  : 'لا تتردد في الاتصال بنا مباشرة لأي سؤال إضافي.'}
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
    </div>
  );
}

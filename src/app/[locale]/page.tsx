import { Locale } from '@/lib/utils/translations';
import HomeInteractiveView from '@/components/home/HomeInteractiveView';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === 'ar' ? 'ar' : 'fr') as Locale;

  return <HomeInteractiveView locale={locale} />;
}

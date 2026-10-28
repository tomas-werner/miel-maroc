import { Locale } from '@/lib/utils/translations';
import { prisma } from '@/lib/db/prisma';
import DynamicSectionRenderer, { SectionModel } from '@/components/sections/DynamicSectionRenderer';
import HomeInteractiveView from '@/components/home/HomeInteractiveView';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === 'ar' ? 'ar' : 'fr') as Locale;

  let customSections: SectionModel[] = [];
  try {
    const dbSections = await prisma.siteSection.findMany({
      where: { page: 'home', isActive: true },
      orderBy: { position: 'asc' },
    });
    if (dbSections && dbSections.length > 0) {
      customSections = dbSections as unknown as SectionModel[];
    }
  } catch (err) {
    // If DB is offline or table not yet created, gracefully fall back
  }

  if (customSections.length > 0) {
    return (
      <main className="min-h-screen">
        <DynamicSectionRenderer sections={customSections} locale={locale} />
      </main>
    );
  }

  return <HomeInteractiveView locale={locale} />;
}

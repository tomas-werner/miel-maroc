import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'nodejs';

// Default fallback sections when DB has no sections or is initializing
export const defaultSections = [
  {
    id: 'default-hero',
    key: 'hero-banner',
    page: 'home',
    title: 'Bannière Principale (Hero)',
    type: 'HERO',
    position: 0,
    isActive: true,
    content: {
      title_fr: "L'Excellence du Miel Pur & Terroir Marocain",
      title_ar: "عسل طبيعي نقي 100% من أجود المناحل المغربية",
      subtitle_fr: "Récolté dans le respect des abeilles et des traditions apicoles ancestrales. 100% brut, non chauffé et certifié.",
      subtitle_ar: "محصول طبيعي من أفضل المناحل المغربية الأصيلة، مستخلص بعناية فائقة للحفاظ على كافة فوائده العلاجية.",
      buttonText_fr: "Découvrir la Collection",
      buttonText_ar: "اكتشف مجموعتنا",
      buttonLink: "/catalogue",
      secondaryButtonText_fr: "En savoir plus",
      secondaryButtonText_ar: "تعرف علينا",
      secondaryButtonLink: "/a-propos",
      badge_fr: "🌿 Récolte 2026 Certifiée Pure",
      badge_ar: "🌿 محصول 2026 خالص ومفحوص",
      backgroundImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1920&q=80",
      mobileImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      overlayOpacity: 40,
    },
  },
  {
    id: 'default-trust',
    key: 'trust-badges',
    page: 'home',
    title: 'Bandeau de Réassurance (Shopify Sense)',
    type: 'TRUST_BADGES',
    position: 1,
    isActive: true,
    content: {
      items: [
        {
          icon: 'Truck',
          title_fr: 'Livraison Express Partout au Maroc',
          subtitle_fr: 'En 24h à 48h (Offerte dès 300 MAD)',
          title_ar: 'توصيل سريع لكافة المدن',
          subtitle_ar: 'خلال 24 إلى 48 ساعة (مجاني للطلبات فوق 300 درهم)',
        },
        {
          icon: 'ShieldCheck',
          title_fr: 'Paiement à la Livraison (COD)',
          subtitle_fr: 'Réglez en espèces à réception en toute sécurité',
          title_ar: 'الدفع عند الاستلام',
          subtitle_ar: 'ادفع نقداً عند استلام طلبيتك بكل أمان',
        },
        {
          icon: 'Leaf',
          title_fr: '100% Naturel & Analysé',
          subtitle_fr: 'Zéro sucre ajouté, sans aucun conservateur',
          title_ar: 'طبيعي 100% وخالٍ من الإضافات',
          subtitle_ar: 'خالٍ من السكر المضاف أو المواد الحافظة',
        },
        {
          icon: 'Award',
          title_fr: 'Qualité Terroir Supérieure',
          subtitle_fr: 'Origine certifiée des terroirs marocains',
          title_ar: 'جودة مغربية أصيلة',
          subtitle_ar: 'منتجات بلدية معتمدة من تعاونيات محلية',
        },
      ],
    },
  },
  {
    id: 'default-featured',
    key: 'featured-products',
    page: 'home',
    title: 'Sélection Vedette (Featured Collection)',
    type: 'FEATURED_COLLECTION',
    position: 2,
    isActive: true,
    content: {
      title_fr: 'Nos Trésors de la Ruche les Plus Prisés',
      title_ar: 'منتجاتنا الأكثر طلباً',
      subtitle_fr: 'Découvrez notre sélection des miels les plus purs et recherchés du Royaume.',
      subtitle_ar: 'تشكيلة مختارة من أندر وأجود أنواع العسل المغربي الطبيعي.',
      viewAllText_fr: 'Voir tout le catalogue',
      viewAllText_ar: 'عرض كامل المنتجات',
      viewAllLink: '/catalogue',
      limit: 4,
    },
  },
  {
    id: 'default-banner',
    key: 'image-banner',
    page: 'home',
    title: 'Bannière Éditoriale / Savoir-Faire',
    type: 'IMAGE_BANNER',
    position: 3,
    isActive: true,
    content: {
      title_fr: "L'Authenticité d'un Terroir Préservé",
      title_ar: "أصالة التراث وعراقة الطبيعة المغربية",
      description_fr: "Nos apiculteurs perpétuent un savoir-faire traditionnel au cœur des montagnes de l'Atlas et du Souss pour vous offrir un nectar d'une pureté absolue.",
      description_ar: "نعمل بشراكة وثيقة مع مربي النحل في أعالي جبال الأطلس وسهول سوس لنضمن لكم عسلاً حراً يحمل روح الطبيعة ونقاءها.",
      buttonText_fr: 'Découvrir Notre Histoire',
      buttonText_ar: 'قصتنا ومصادرنا',
      buttonLink: '/a-propos',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1600&q=80',
    },
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || 'home';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    try {
      const whereClause: { page: string; isActive?: boolean } = { page };
      if (activeOnly) {
        whereClause.isActive = true;
      }

      const sections = await prisma.siteSection.findMany({
        where: whereClause,
        orderBy: { position: 'asc' },
      });

      if (sections && sections.length > 0) {
        return NextResponse.json({ sections });
      }
    } catch (dbErr) {
      console.warn('Prisma query for SiteSection failed, falling back to defaults:', dbErr);
    }

    const filteredDefaults = activeOnly
      ? defaultSections.filter((s) => s.isActive && s.page === page)
      : defaultSections.filter((s) => s.page === page);

    return NextResponse.json({ sections: filteredDefaults, isFallback: true });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ sections: defaultSections, isFallback: true });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Format invalide : sections doit être une liste' }, { status: 400 });
    }

    const updatedSections = [];
    for (let index = 0; index < sections.length; index++) {
      const sec = sections[index];
      const position = typeof sec.position === 'number' ? sec.position : index;

      try {
        const item = await prisma.siteSection.upsert({
          where: { key: sec.key },
          update: {
            title: sec.title,
            type: sec.type,
            position,
            isActive: sec.isActive ?? true,
            content: sec.content || {},
          },
          create: {
            key: sec.key,
            page: sec.page || 'home',
            title: sec.title,
            type: sec.type,
            position,
            isActive: sec.isActive ?? true,
            content: sec.content || {},
          },
        });
        updatedSections.push(item);
      } catch (err) {
        console.warn(`Could not save section ${sec.key} to database:`, err);
        updatedSections.push({ ...sec, position });
      }
    }

    return NextResponse.json({ success: true, sections: updatedSections });
  } catch (error) {
    console.error('Error updating sections:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour des sections' },
      { status: 500 }
    );
  }
}

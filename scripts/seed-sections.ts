import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Auto-load .env if DATABASE_URL is not yet defined in environment
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          const val = values.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  } catch (err) {
    // Ignore and proceed
  }
}

const prisma = new PrismaClient();

const initialSections = [
  {
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

async function main() {
  console.log('Seeding initial Shopify-style site sections...');

  for (const section of initialSections) {
    const upserted = await prisma.siteSection.upsert({
      where: { key: section.key },
      update: {
        title: section.title,
        type: section.type,
        position: section.position,
        isActive: section.isActive,
        content: section.content,
      },
      create: {
        key: section.key,
        page: section.page,
        title: section.title,
        type: section.type,
        position: section.position,
        isActive: section.isActive,
        content: section.content,
      },
    });
    console.log(`✓ Section "${upserted.key}" (${upserted.type}) synchronisée.`);
  }

  console.log('\nToutes les sections ont été initialisées avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding des sections:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

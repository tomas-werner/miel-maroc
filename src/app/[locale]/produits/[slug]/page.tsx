import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/lib/utils/translations';
import { getProductBySlug } from '@/lib/products/catalog';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { prisma } from '@/lib/db/prisma';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = (locale === 'ar' ? 'ar' : 'fr') as Locale;

  // 1. Try curated Moroccan terroir product
  const product = getProductBySlug(slug);

  if (product) {
    const title = loc === 'fr' ? product.nameFr : product.nameAr;
    const desc = loc === 'fr' ? product.shortDescFr : product.shortDescAr;
    const priceText = `${product.basePrice} MAD`;
    const fullTitle = `${title} - ${priceText} | Miel & Terroir Maroc`;
    const imgUrl = product.images[0]?.url || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200';
    const canonicalUrl = `https://miel.ma/${loc}/produits/${product.slug}`;

    return {
      title: fullTitle,
      description: desc,
      openGraph: {
        title: fullTitle,
        description: desc,
        url: canonicalUrl,
        siteName: loc === 'fr' ? 'Miel Boutique Maroc' : 'متجر عسل المغرب',
        images: [
          {
            url: imgUrl,
            width: 1200,
            height: 800,
            alt: title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description: desc,
        images: [imgUrl],
      },
    };
  }

  // 2. Try database product
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    if (dbProduct) {
      const title = loc === 'fr' ? dbProduct.nameFr : dbProduct.nameAr;
      const desc = loc === 'fr' ? dbProduct.descriptionFr : dbProduct.descriptionAr;
      const priceText = `${Number(dbProduct.basePrice).toFixed(0)} MAD`;
      const fullTitle = `${title} - ${priceText} | Miel & Terroir Maroc`;
      const imgUrl = dbProduct.images[0]?.storageKey || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200';

      return {
        title: fullTitle,
        description: desc.slice(0, 160),
        openGraph: {
          title: fullTitle,
          description: desc.slice(0, 160),
          images: [{ url: imgUrl, width: 1200, height: 800, alt: title }],
        },
      };
    }
  } catch {
    // ignore DB errors during metadata generation
  }

  return {
    title: loc === 'fr' ? 'Fiche Produit | Miel & Terroir Maroc' : 'تفاصيل المنتج | متجر عسل المغرب',
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const loc = (locale === 'ar' ? 'ar' : 'fr') as Locale;

  // 1. Check curated terroir product
  let productData = getProductBySlug(slug);

  // 2. If not found in static list, check database and map
  if (!productData) {
    try {
      const dbProduct = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: { inventory: true },
          },
          images: { orderBy: { sortOrder: 'asc' } },
        },
      });

      if (dbProduct) {
        productData = {
          id: dbProduct.id,
          slug: dbProduct.slug,
          nameFr: dbProduct.nameFr,
          nameAr: dbProduct.nameAr,
          categoryNameFr: dbProduct.category.nameFr,
          categoryNameAr: dbProduct.category.nameAr,
          categorySlug: dbProduct.category.slug,
          basePrice: Number(dbProduct.basePrice),
          originalPrice: Number(dbProduct.basePrice) * 1.3,
          rating: 4.9,
          reviewsCount: 42,
          originFr: 'Région du Maroc',
          originAr: 'المملكة المغربية',
          harvestFr: 'Récolte 2026',
          harvestAr: 'جني 2026',
          shortDescFr: dbProduct.descriptionFr.slice(0, 200),
          shortDescAr: dbProduct.descriptionAr.slice(0, 200),
          longDescFr: dbProduct.descriptionFr,
          longDescAr: dbProduct.descriptionAr,
          benefitsFr: [
            'Produit 100% pur et authentique',
            'Stock propre vérifié et contrôlé',
            'Livraison rapide partout au Maroc',
          ],
          benefitsAr: [
            'منتج نقي ومضمون 100%',
            'مخزون خاص ومراقب الجودة',
            'توصيل سريع لجميع مدن المغرب',
          ],
          usageAdviceFr: 'Conserver à l’abri de la chaleur et de l’humidité.',
          usageAdviceAr: 'يحفظ في مكان جاف ومعتدل الحرارة.',
          images: dbProduct.images.length > 0
            ? dbProduct.images.map((img) => ({
                url: img.storageKey,
                altFr: img.altFr || dbProduct.nameFr,
                altAr: img.altAr || dbProduct.nameAr,
              }))
            : [
                {
                  url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
                  altFr: dbProduct.nameFr,
                  altAr: dbProduct.nameAr,
                },
              ],
          variants: dbProduct.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            labelFr: (v.attributes as any)?.format || v.sku,
            labelAr: (v.attributes as any)?.format || v.sku,
            price: v.priceOverride ? Number(v.priceOverride) : Number(dbProduct.basePrice),
            stock: v.inventory?.quantityOnHand || 10,
          })),
        };
      }
    } catch (err) {
      console.error('Error fetching db product:', err);
    }
  }

  if (!productData) {
    notFound();
  }

  return <ProductDetailClient product={productData} locale={loc} />;
}

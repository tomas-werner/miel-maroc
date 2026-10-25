import { MetadataRoute } from 'next';
import { locales } from '@/lib/utils/translations';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const staticPages = [
    '',
    '/catalogue',
    '/contact',
    '/faq',
    '/livraison',
    '/retours-remboursements',
    '/conditions-generales',
    '/confidentialite',
    '/mentions-legales',
    '/a-propos',
    '/connexion',
    '/inscription',
    '/panier',
    '/compte',
    '/favoris',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate URLs for each locale
  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import {
  Home,
  Save,
  X,
  ArrowLeft,
  Layout,
  Image as ImageIcon
} from 'lucide-react';

interface HomepageContent {
  heroBanner: string | null;
  featuredProducts: string[];
  showCategories: boolean;
  showReviews: boolean;
}

export default function HomepageContentPage() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<HomepageContent>({
    heroBanner: null,
    featuredProducts: [],
    showCategories: true,
    showReviews: true,
  });
  const [availableBanners, setAvailableBanners] = useState<any[]>([]);
  const router = useRouter();

  const direction = getDirection(locale);

  useEffect(() => {
    fetchContent();
    fetchBanners();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/moderator/content/homepage');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch homepage content:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/moderator/content');
      if (response.ok) {
        const data = await response.json();
        setAvailableBanners(data.filter((b: any) => b.blockType === 'banner'));
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/moderator/content/homepage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        alert(locale === 'fr' ? 'Page d\'accueil mise à jour' : 'تم تحديث الصفحة الرئيسية');
      } else {
        const error = await response.json();
        alert(locale === 'fr' ? 'Erreur: ' + error.error : 'خطأ: ' + error.error);
      }
    } catch (error) {
      console.error('Homepage update error:', error);
      alert(locale === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${direction}`} dir={direction}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/moderateur"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation(locale, 'common.back')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'fr' ? 'Contenu de la page d\'accueil' : 'محتوى الصفحة الرئيسية'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'fr' ? 'Configurez les éléments affichés sur la page d\'accueil' : 'تكوين العناصر المعروضة على الصفحة الرئيسية'}
          </p>
        </div>

        <div className="max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {locale === 'fr' ? 'Bannière principale' : 'البانر الرئيسي'}
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'fr' ? 'Sélectionner une bannière' : 'اختيار بانر'}
                </label>
                <select
                  value={content.heroBanner || ''}
                  onChange={(e) => setContent({ ...content, heroBanner: e.target.value || null })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">
                    {locale === 'fr' ? 'Aucune bannière' : 'لا يوجد بانر'}
                  </option>
                  {availableBanners.map((banner) => (
                    <option key={banner.id} value={banner.id}>
                      {locale === 'fr' ? banner.titleFr : banner.titleAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Products */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layout className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {locale === 'fr' ? 'Produits mis en avant' : 'المنتجات المميزة'}
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {locale === 'fr' 
                  ? 'Les produits marqués comme "À la une" seront affichés automatiquement' 
                  : 'سيتم عرض المنتجات المميزة تلقائياً'}
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  {locale === 'fr'
                    ? '💡 Astuce: Pour mettre un produit en avant, allez dans la liste des produits et cliquez sur l\'icône "œil"'
                    : '💡 نصيحة: لتمييز منتج، انتقل إلى قائمة المنتجات وانقر على أيقونة "العين"'}
                </p>
              </div>
            </div>

            {/* Sections Visibility */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Home className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {locale === 'fr' ? 'Visibilité des sections' : 'رؤية الأقسام'}
                </h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">
                      {locale === 'fr' ? 'Afficher les catégories' : 'عرض الفئات'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {locale === 'fr' ? 'Affiche la grille des catégories sur la page d\'accueil' : 'عرض شبكة الفئات على الصفحة الرئيسية'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={content.showCategories}
                    onChange={(e) => setContent({ ...content, showCategories: e.target.checked })}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">
                      {locale === 'fr' ? 'Afficher les avis clients' : 'عرض تقييمات العملاء'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {locale === 'fr' ? 'Affiche la section des avis clients' : 'عرض قسم تقييمات العملاء'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={content.showReviews}
                    onChange={(e) => setContent({ ...content, showReviews: e.target.checked })}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading
                  ? getTranslation(locale, 'common.loading')
                  : (locale === 'fr' ? 'Enregistrer les modifications' : 'حفظ التغييرات')}
              </button>

              <Link
                href="/moderateur"
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                <X className="w-5 h-5" />
                {getTranslation(locale, 'moderator.productForm.cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

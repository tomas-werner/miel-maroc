'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import { FolderTree, Save, X, ArrowLeft } from 'lucide-react';

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [locale, setLocale] = useState<Locale>('fr');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    nameFr: '',
    nameAr: '',
    descriptionFr: '',
    descriptionAr: '',
    parentId: '',
    sortOrder: 0,
    isActive: true,
  });

  const direction = getDirection(locale);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchCategories(), fetchCategory()]);
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/moderator/categories/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          nameFr: data.nameFr,
          nameAr: data.nameAr,
          descriptionFr: data.descriptionFr || '',
          descriptionAr: data.descriptionAr || '',
          parentId: data.parentId || '',
          sortOrder: data.sortOrder,
          isActive: data.isActive,
        });
      }
    } catch (error) {
      console.error('Failed to fetch category:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = await params;
      const categoryData = {
        ...formData,
        parentId: formData.parentId || null,
        sortOrder: parseInt(formData.sortOrder.toString()) || 0,
      };

      const response = await fetch(`/api/moderator/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        router.push('/moderateur/categories');
      } else {
        const error = await response.json();
        alert(locale === 'fr' ? 'Erreur: ' + error.error : 'خطأ: ' + error.error);
      }
    } catch (error) {
      console.error('Category update error:', error);
      alert(locale === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>{getTranslation(locale, 'common.loading')}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${direction}`} dir={direction}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/moderateur/categories"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation(locale, 'common.back')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'fr' ? 'Modifier la catégorie' : 'تعديل الفئة'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'fr' ? 'Modifiez les informations de la catégorie' : 'تعديل معلومات الفئة'}
          </p>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Informations de base' : 'المعلومات الأساسية'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Nom (Français)' : 'الاسم (فرنسي)'}
                  </label>
                  <input
                    type="text"
                    name="nameFr"
                    value={formData.nameFr}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Nom (Arabe)' : 'الاسم (عربي)'}
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Description (Français)' : 'الوصف (فرنسي)'}
                  </label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Description (Arabe)' : 'الوصف (عربي)'}
                  </label>
                  <textarea
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Hierarchy */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Hiérarchie' : 'التسلسل الهرمي'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Catégorie parente' : 'الفئة الأصل'}
                  </label>
                  <select
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">
                      {locale === 'fr' ? 'Aucune (catégorie racine)' : 'لا شيء (فئة رئيسية)'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {locale === 'fr' ? cat.nameFr : cat.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Ordre de tri' : 'ترتيب الفرز'}
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Statut' : 'الحالة'}
              </h2>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {locale === 'fr' ? 'Catégorie active' : 'فئة نشطة'}
                </span>
              </label>
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
                  : (locale === 'fr' ? 'Enregistrer' : 'حفظ')}
              </button>

              <Link
                href="/moderateur/categories"
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

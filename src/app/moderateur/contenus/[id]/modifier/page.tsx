'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import {
  Image as ImageIcon,
  Save,
  X,
  ArrowLeft,
  Upload
} from 'lucide-react';

export default function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const [locale, setLocale] = useState<Locale>('fr');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    titleFr: '',
    titleAr: '',
    bodyFr: '',
    bodyAr: '',
    targetUrl: '',
    sortOrder: 0,
    isActive: true,
    startsAt: '',
    endsAt: '',
  });

  const direction = getDirection(locale);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/moderator/content/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          titleFr: data.titleFr || '',
          titleAr: data.titleAr || '',
          bodyFr: data.bodyFr || '',
          bodyAr: data.bodyAr || '',
          targetUrl: data.targetUrl || '',
          sortOrder: data.sortOrder,
          isActive: data.isActive,
          startsAt: data.startsAt ? new Date(data.startsAt).toISOString().slice(0, 16) : '',
          endsAt: data.endsAt ? new Date(data.endsAt).toISOString().slice(0, 16) : '',
        });
        if (data.mediaKey) {
          setImagePreview(data.mediaKey);
        }
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = await params;
      const mediaKey = imageFile ? `uploads/${Date.now()}_${imageFile.name}` : imagePreview;

      const contentData = {
        ...formData,
        mediaKey,
        startsAt: formData.startsAt ? new Date(formData.startsAt) : null,
        endsAt: formData.endsAt ? new Date(formData.endsAt) : null,
        sortOrder: parseInt(formData.sortOrder.toString()) || 0,
      };

      const response = await fetch(`/api/moderator/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });

      if (response.ok) {
        router.push('/moderateur/contenus');
      } else {
        const error = await response.json();
        alert(locale === 'fr' ? 'Erreur: ' + error.error : 'خطأ: ' + error.error);
      }
    } catch (error) {
      console.error('Content update error:', error);
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
            href="/moderateur/contenus"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {getTranslation(locale, 'common.back')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'fr' ? 'Modifier le contenu' : 'تعديل المحتوى'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'fr' ? 'Modifiez les informations du contenu' : 'تعديل معلومات المحتوى'}
          </p>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Image' : 'الصورة'}
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="mt-4 text-sm text-red-600 hover:text-red-700"
                    >
                      {locale === 'fr' ? 'Supprimer l\'image' : 'حذف الصورة'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      {locale === 'fr' ? 'Glissez-déposez une image ici' : 'اسحب وأفلت صورة هنا'}
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg cursor-pointer hover:bg-amber-700 transition">
                      <span>{locale === 'fr' ? 'Choisir un fichier' : 'اختيار ملف'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Contenu' : 'المحتوى'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Titre (Français)' : 'العنوان (فرنسي)'}
                  </label>
                  <input
                    type="text"
                    name="titleFr"
                    value={formData.titleFr}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Titre (Arabe)' : 'العنوان (عربي)'}
                  </label>
                  <input
                    type="text"
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Description (Français)' : 'الوصف (فرنسي)'}
                  </label>
                  <textarea
                    name="bodyFr"
                    value={formData.bodyFr}
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
                    name="bodyAr"
                    value={formData.bodyAr}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'URL de destination' : 'رابط الوجهة'}
                  </label>
                  <input
                    type="url"
                    name="targetUrl"
                    value={formData.targetUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Planification' : 'الجدولة'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Date de début' : 'تاريخ البدء'}
                  </label>
                  <input
                    type="datetime-local"
                    name="startsAt"
                    value={formData.startsAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Date de fin' : 'تاريخ الانتهاء'}
                  </label>
                  <input
                    type="datetime-local"
                    name="endsAt"
                    value={formData.endsAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Paramètres' : 'الإعدادات'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'fr' ? 'Ordre d\'affichage' : 'ترتيب العرض'}
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

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {locale === 'fr' ? 'Contenu actif' : 'محتوى نشط'}
                  </span>
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
                  : (locale === 'fr' ? 'Enregistrer' : 'حفظ')}
              </button>

              <Link
                href="/moderateur/contenus"
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

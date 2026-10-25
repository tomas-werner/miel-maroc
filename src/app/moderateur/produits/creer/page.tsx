'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import { Package, Save, X, Plus, Trash2, Eye, ArrowLeft } from 'lucide-react';

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
}

interface Variant {
  id: string;
  sku: string;
  attributes: string;
  priceOverride: string;
  isActive: boolean;
  stock: string;
}

export default function CreateProductPage() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    nameFr: '',
    nameAr: '',
    descriptionFr: '',
    descriptionAr: '',
    categoryId: '',
    brand: '',
    basePrice: '',
    currency: 'MAD',
    status: 'DRAFT',
    isFeatured: false,
  });

  const [variants, setVariants] = useState<Variant[]>([
    {
      id: '1',
      sku: '',
      attributes: '{}',
      priceOverride: '',
      isActive: true,
      stock: '0',
    },
  ]);

  const direction = getDirection(locale);

  useEffect(() => {
    fetchCategories();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVariantChange = (id: string, field: keyof Variant, value: string | boolean) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sku: '',
        attributes: '{}',
        priceOverride: '',
        isActive: true,
        stock: '0',
      },
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice) || 0,
        variants: variants.map(v => ({
          sku: v.sku,
          attributes: JSON.parse(v.attributes || '{}'),
          priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
          isActive: v.isActive,
          stock: parseInt(v.stock) || 0,
        })),
      };

      const response = await fetch('/api/moderator/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push('/moderateur/produits');
      } else {
        const error = await response.json();
        alert(locale === 'fr' ? 'Erreur: ' + error.error : 'خطأ: ' + error.error);
      }
    } catch (error) {
      console.error('Product creation error:', error);
      alert(locale === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const parseAttributes = (attributes: string) => {
    try {
      return JSON.parse(attributes);
    } catch {
      return {};
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
            {getTranslation(locale, 'moderator.createProduct')}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'fr'
              ? 'Créez un nouveau produit avec toutes ses variantes'
              : 'إنشاء منتج جديد مع جميع أنواعه'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Informations de base' : 'المعلومات الأساسية'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation(locale, 'moderator.productForm.nameFr')}
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
                    {getTranslation(locale, 'moderator.productForm.nameAr')}
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
                    {getTranslation(locale, 'moderator.productForm.descriptionFr')}
                  </label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation(locale, 'moderator.productForm.descriptionAr')}
                  </label>
                  <textarea
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fr' ? 'Détails du produit' : 'تفاصيل المنتج'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getTranslation(locale, 'moderator.productForm.category')}
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">
                      {locale === 'fr' ? 'Sélectionner une catégorie' : 'اختر فئة'}
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
                    {getTranslation(locale, 'moderator.productForm.brand')}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getTranslation(locale, 'moderator.productForm.basePrice')}
                    </label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getTranslation(locale, 'moderator.productForm.currency')}
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="MAD">MAD</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getTranslation(locale, 'moderator.productForm.status')}
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="DRAFT">{getTranslation(locale, 'moderator.status.draft')}</option>
                      <option value="PUBLISHED">{getTranslation(locale, 'moderator.status.published')}</option>
                      <option value="ARCHIVED">{getTranslation(locale, 'moderator.status.archived')}</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {getTranslation(locale, 'moderator.productForm.isFeatured')}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {getTranslation(locale, 'moderator.productForm.variants')}
                </h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100"
                >
                  <Plus className="w-4 h-4" />
                  {getTranslation(locale, 'moderator.productForm.addVariant')}
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {locale === 'fr' ? 'Variante' : 'النوع'} {index + 1}
                      </span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {getTranslation(locale, 'moderator.productForm.sku')}
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {getTranslation(locale, 'moderator.productForm.priceOverride')}
                        </label>
                        <input
                          type="number"
                          value={variant.priceOverride}
                          onChange={(e) => handleVariantChange(variant.id, 'priceOverride', e.target.value)}
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {getTranslation(locale, 'moderator.productForm.stock')}
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                          min="0"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={variant.isActive}
                            onChange={(e) => handleVariantChange(variant.id, 'isActive', e.target.checked)}
                            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {getTranslation(locale, 'moderator.productForm.isActive')}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {getTranslation(locale, 'moderator.productForm.attributes')} (JSON)
                      </label>
                      <textarea
                        value={variant.attributes}
                        onChange={(e) => handleVariantChange(variant.id, 'attributes', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                        placeholder='{"size": "M", "color": "red"}'
                      />
                    </div>
                  </div>
                ))}
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
                  : getTranslation(locale, 'moderator.productForm.save')}
              </button>

              <Link
                href="/moderateur"
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                <X className="w-5 h-5" />
                {getTranslation(locale, 'moderator.productForm.cancel')}
              </Link>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                <Eye className="w-5 h-5" />
                {getTranslation(locale, 'moderator.productForm.preview')}
              </button>
            </div>
          </form>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {getTranslation(locale, 'moderator.productForm.preview')}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {locale === 'fr' ? formData.nameFr : formData.nameAr}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {locale === 'fr' ? formData.descriptionFr : formData.descriptionAr}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-amber-600">
                    {formData.basePrice} {formData.currency}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : formData.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {getTranslation(locale, `moderator.status.${formData.status.toLowerCase()}`)}
                  </span>
                  {formData.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                      {getTranslation(locale, 'moderator.productForm.isFeatured')}
                    </span>
                  )}
                </div>

                {formData.brand && (
                  <div>
                    <span className="text-sm text-gray-600">
                      {locale === 'fr' ? 'Marque: ' : 'العلامة التجارية: '}
                      {formData.brand}
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {getTranslation(locale, 'moderator.productForm.variants')}
                  </h4>
                  <div className="space-y-2">
                    {variants.map((variant, index) => (
                      <div key={variant.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {variant.sku || `SKU ${index + 1}`}
                          </span>
                          <span className="text-sm text-gray-600">
                            {variant.priceOverride
                              ? `${variant.priceOverride} ${formData.currency}`
                              : `${formData.basePrice} ${formData.currency}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{locale === 'fr' ? 'Stock: ' : 'المخزون: '}{variant.stock}</span>
                          <span>
                            {variant.isActive
                              ? locale === 'fr'
                                ? 'Actif'
                                : 'نشط'
                              : locale === 'fr'
                              ? 'Inactif'
                              : 'غير نشط'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

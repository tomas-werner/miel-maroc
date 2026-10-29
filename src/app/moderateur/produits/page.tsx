'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import {
  Package,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  status: string;
  basePrice: number;
  currency: string;
  isFeatured: boolean;
  category: {
    nameFr: string;
    nameAr: string;
  };
  createdAt: string;
}

export default function ProductsListPage() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/moderator/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'fr' ? 'Êtes-vous sûr de vouloir supprimer ce produit ?' : 'هل أنت متأكد من حذف هذا المنتج؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/moderator/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert(locale === 'fr' ? 'Erreur lors de la suppression' : 'خطأ في الحذف');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(locale === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ');
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/moderator/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === id ? { ...p, isFeatured: !currentStatus } : p
        ));
      }
    } catch (error) {
      console.error('Toggle featured error:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameAr.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const direction = getDirection(locale);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getTranslation(locale, 'moderator.products')}
              </h1>
              <p className="text-gray-600 mt-2">
                {locale === 'fr' ? 'Gérez tous vos produits' : 'إدارة جميع منتجاتك'}
              </p>
            </div>
            <Link
              href="/moderateur/produits/creer"
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              <Plus className="w-5 h-5" />
              {getTranslation(locale, 'moderator.addProduct')}
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={locale === 'fr' ? 'Rechercher un produit...' : 'البحث عن منتج...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="ALL">{locale === 'fr' ? 'Tous les statuts' : 'جميع الحالات'}</option>
                <option value="DRAFT">{getTranslation(locale, 'moderator.status.draft')}</option>
                <option value="PUBLISHED">{getTranslation(locale, 'moderator.status.published')}</option>
                <option value="ARCHIVED">{getTranslation(locale, 'moderator.status.archived')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              {getTranslation(locale, 'common.loading')}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>
                {locale === 'fr' ? 'Aucun produit trouvé' : 'لم يتم العثور على منتجات'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'fr' ? 'Produit' : 'المنتج'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'fr' ? 'Catégorie' : 'الفئة'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'fr' ? 'Prix' : 'السعر'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'fr' ? 'Statut' : 'الحالة'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'fr' ? 'Actions' : 'الإجراءات'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Package className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {locale === 'fr' ? product.nameFr : product.nameAr}
                            </p>
                            <p className="text-sm text-gray-500">{product.slug}</p>
                          </div>
                          {product.isFeatured && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                              {locale === 'fr' ? 'À la une' : 'مميز'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {locale === 'fr' ? product.category.nameFr : product.category.nameAr}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {product.basePrice} {product.currency}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700'
                              : product.status === 'DRAFT'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {getTranslation(locale, `moderator.status.${product.status.toLowerCase()}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title={product.isFeatured ? (locale === 'fr' ? 'Retirer de la une' : 'إزالة من المميز') : (locale === 'fr' ? 'Mettre à la une' : 'وضع كمميز')}
                          >
                            {product.isFeatured ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <Link
                            href={`/moderateur/produits/${product.id}/modifier`}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            title={locale === 'fr' ? 'Modifier' : 'تعديل'}
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title={locale === 'fr' ? 'Supprimer' : 'حذف'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

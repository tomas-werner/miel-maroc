'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import {
  FolderTree,
  Edit,
  Trash2,
  Plus,
  Search,
  ArrowLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId: string | null;
  children: Category[];
  productsCount: number;
}

export default function CategoriesListPage() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/moderator/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette catégorie ?' : 'هل أنت متأكد من حذف هذه الفئة؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/moderator/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert(locale === 'fr' ? 'Erreur lors de la suppression' : 'خطأ في الحذف');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(locale === 'fr' ? 'Une erreur est survenue' : 'حدث خطأ');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/moderator/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setCategories(categories.map(c => 
          c.id === id ? { ...c, isActive: !currentStatus } : c
        ));
      }
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.nameAr.includes(searchTerm);
    return matchesSearch;
  });

  const renderCategory = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id}>
        <div 
          className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-200"
          style={{ paddingLeft: `${16 + level * 24}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <div className="p-2 bg-blue-100 rounded-lg">
            <FolderTree className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {locale === 'fr' ? category.nameFr : category.nameAr}
            </p>
            <p className="text-sm text-gray-500">{category.slug}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {category.productsCount} {locale === 'fr' ? 'produits' : 'منتجات'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                category.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.isActive ? (locale === 'fr' ? 'Actif' : 'نشط') : (locale === 'fr' ? 'Inactif' : 'غير نشط')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleActive(category.id, category.isActive)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title={category.isActive ? (locale === 'fr' ? 'Désactiver' : 'تعطيل') : (locale === 'fr' ? 'Activer' : 'تفعيل')}
            >
              {category.isActive ? (
                <span className="w-4 h-4 bg-green-500 rounded-full" />
              ) : (
                <span className="w-4 h-4 bg-gray-300 rounded-full" />
              )}
            </button>
            <Link
              href={`/moderateur/categories/${category.id}/modifier`}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title={locale === 'fr' ? 'Modifier' : 'تعديل'}
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title={locale === 'fr' ? 'Supprimer' : 'حذف'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {isExpanded && hasChildren && category.children.map(child => renderCategory(child, level + 1))}
      </div>
    );
  };

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
                {getTranslation(locale, 'moderator.categories')}
              </h1>
              <p className="text-gray-600 mt-2">
                {locale === 'fr' ? 'Gérez vos catégories de produits' : 'إدارة فئات المنتجات'}
              </p>
            </div>
            <Link
              href="/moderateur/categories/creer"
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              <Plus className="w-5 h-5" />
              {getTranslation(locale, 'moderator.addCategory')}
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={locale === 'fr' ? 'Rechercher une catégorie...' : 'البحث عن فئة...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              {getTranslation(locale, 'common.loading')}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FolderTree className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>
                {locale === 'fr' ? 'Aucune catégorie trouvée' : 'لم يتم العثور على فئات'}
              </p>
            </div>
          ) : (
            <div>
              {filteredCategories.map(category => renderCategory(category))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

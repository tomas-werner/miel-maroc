'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import {
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  Search,
  ArrowLeft,
  Layout
} from 'lucide-react';

interface ContentBlock {
  id: string;
  blockType: string;
  titleFr: string | null;
  titleAr: string | null;
  bodyFr: string | null;
  bodyAr: string | null;
  mediaKey: string | null;
  targetUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export default function ContentManagementPage() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const router = useRouter();

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const fetchContentBlocks = async () => {
    try {
      const response = await fetch('/api/moderator/content');
      if (response.ok) {
        const data = await response.json();
        setContentBlocks(data);
      }
    } catch (error) {
      console.error('Failed to fetch content blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'fr' ? 'Êtes-vous sûr de vouloir supprimer ce contenu ?' : 'هل أنت متأكد من حذف هذا المحتوى؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/moderator/content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContentBlocks(contentBlocks.filter(c => c.id !== id));
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
      const response = await fetch(`/api/moderator/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setContentBlocks(contentBlocks.map(c => 
          c.id === id ? { ...c, isActive: !currentStatus } : c
        ));
      }
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

  const filteredContent = contentBlocks.filter(block => {
    const matchesSearch = 
      (block.titleFr?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (block.titleAr?.includes(searchTerm) || false);
    const matchesType = typeFilter === 'ALL' || block.blockType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getBlockTypeLabel = (type: string) => {
    switch (type) {
      case 'banner':
        return locale === 'fr' ? 'Bannière' : 'بانر';
      case 'collection':
        return locale === 'fr' ? 'Collection' : 'مجموعة';
      case 'text':
        return locale === 'fr' ? 'Texte' : 'نص';
      default:
        return type;
    }
  };

  const getBlockTypeIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return ImageIcon;
      case 'collection':
        return Layout;
      default:
        return ImageIcon;
    }
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
                {getTranslation(locale, 'moderator.content')}
              </h1>
              <p className="text-gray-600 mt-2">
                {locale === 'fr' ? 'Gérez les bannières et contenus du site' : 'إدارة البانرات ومحتوى الموقع'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/moderateur/contenus/bannieres"
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
              >
                <Plus className="w-5 h-5" />
                {locale === 'fr' ? 'Ajouter une bannière' : 'إضافة بانر'}
              </Link>
            </div>
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
                  placeholder={locale === 'fr' ? 'Rechercher du contenu...' : 'البحث عن محتوى...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="ALL">{locale === 'fr' ? 'Tous les types' : 'جميع الأنواع'}</option>
                <option value="banner">{locale === 'fr' ? 'Bannières' : 'بانرات'}</option>
                <option value="collection">{locale === 'fr' ? 'Collections' : 'مجموعات'}</option>
                <option value="text">{locale === 'fr' ? 'Textes' : 'نصوص'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              {getTranslation(locale, 'common.loading')}
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>
                {locale === 'fr' ? 'Aucun contenu trouvé' : 'لم يتم العثور على محتوى'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredContent.map((block) => {
                const Icon = getBlockTypeIcon(block.blockType);
                return (
                  <div key={block.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          block.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {block.isActive ? (locale === 'fr' ? 'Actif' : 'نشط') : (locale === 'fr' ? 'Inactif' : 'غير نشط')}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {locale === 'fr' ? block.titleFr : block.titleAr}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {getBlockTypeLabel(block.blockType)}
                    </p>
                    
                    {block.startsAt && (
                      <p className="text-xs text-gray-400">
                        {locale === 'fr' ? 'Du' : 'من'} {new Date(block.startsAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleActive(block.id, block.isActive)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition flex-1"
                      >
                        {block.isActive ? (
                          <span className="text-xs">{locale === 'fr' ? 'Désactiver' : 'تعطيل'}</span>
                        ) : (
                          <span className="text-xs">{locale === 'fr' ? 'Activer' : 'تفعيل'}</span>
                        )}
                      </button>
                      <Link
                        href={`/moderateur/contenus/${block.id}/modifier`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(block.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

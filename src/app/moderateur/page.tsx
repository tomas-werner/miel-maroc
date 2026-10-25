'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/utils/translations';
import { getTranslation, getDirection } from '@/lib/utils/translations';
import {
  Package,
  FolderTree,
  Image as ImageIcon,
  Home,
  Plus,
  TrendingUp,
  Clock,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  activeBanners: number;
  recentProducts: Array<{
    id: string;
    nameFr: string;
    nameAr: string;
    status: string;
    createdAt: string;
  }>;
}

export default function ModeratorDashboard() {
  const [locale, setLocale] = useState<Locale>('fr');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/moderator/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/moderateur/connexion');
  };

  const direction = getDirection(locale);

  const quickActions = [
    {
      title: getTranslation(locale, 'moderator.addProduct'),
      description: locale === 'fr' ? 'Créer un nouveau produit' : 'إنشاء منتج جديد',
      icon: Package,
      href: '/moderateur/produits/creer',
      color: 'bg-amber-500',
    },
    {
      title: getTranslation(locale, 'moderator.addCategory'),
      description: locale === 'fr' ? 'Ajouter une catégorie' : 'إضافة فئة',
      icon: FolderTree,
      href: '/moderateur/categories/creer',
      color: 'bg-blue-500',
    },
    {
      title: getTranslation(locale, 'moderator.addBanner'),
      description: locale === 'fr' ? 'Créer une bannière' : 'إنشاء بانر',
      icon: ImageIcon,
      href: '/moderateur/contenus/bannieres',
      color: 'bg-green-500',
    },
  ];

  const navigation = [
    {
      title: getTranslation(locale, 'moderator.dashboard'),
      icon: BarChart3,
      href: '/moderateur',
      active: true,
    },
    {
      title: getTranslation(locale, 'moderator.products'),
      icon: Package,
      href: '/moderateur/produits',
    },
    {
      title: getTranslation(locale, 'moderator.categories'),
      icon: FolderTree,
      href: '/moderateur/categories',
    },
    {
      title: getTranslation(locale, 'moderator.content'),
      icon: ImageIcon,
      href: '/moderateur/contenus',
    },
    {
      title: getTranslation(locale, 'moderator.homepage'),
      icon: Home,
      href: '/moderateur/contenus/accueil',
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${direction}`} dir={direction}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">
              {getTranslation(locale, 'moderator.dashboard')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {locale === 'fr' ? 'Espace modérateur' : 'مساحة المشرف'}
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {getTranslation(locale, 'nav.logout')}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {getTranslation(locale, 'moderator.overview')}
            </h2>
            <p className="text-gray-600 mt-2">
              {locale === 'fr'
                ? 'Bienvenue dans votre espace de gestion'
                : 'مرحباً بك في مساحة الإدارة الخاصة بك'}
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {getTranslation(locale, 'moderator.totalProducts')}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '-' : stats?.totalProducts || 0}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {getTranslation(locale, 'moderator.totalCategories')}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '-' : stats?.totalCategories || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FolderTree className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {getTranslation(locale, 'moderator.activeBanners')}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '-' : stats?.activeBanners || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {getTranslation(locale, 'moderator.quickActions')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <div className={`p-3 ${action.color} rounded-full w-fit mb-4`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent products */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {getTranslation(locale, 'moderator.recentProducts')}
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  {getTranslation(locale, 'common.loading')}
                </div>
              ) : stats?.recentProducts && stats.recentProducts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {stats.recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {locale === 'fr' ? product.nameFr : product.nameAr}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'ar-MA')}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : product.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {getTranslation(locale, `moderator.status.${product.status.toLowerCase()}`)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  {locale === 'fr'
                    ? 'Aucun produit récent'
                    : 'لا توجد منتجات حديثة'}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

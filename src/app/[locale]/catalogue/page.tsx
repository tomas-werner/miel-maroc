'use client';

import { useState, useEffect } from 'react';
import { Locale, t, getDirection } from '@/lib/utils/translations';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  basePrice: number;
  currency: string;
  images: { storageKey: string; altFr?: string; altAr?: string }[];
  variants: {
    id: string;
    sku: string;
    priceOverride?: number;
    inventory?: { quantityOnHand: number };
  }[];
}

interface CatalogPageProps {
  params: Promise<{ locale: string }>;
}

export default function CatalogPage({ params }: CatalogPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    params.then((resolvedParams) => {
      setLocale(resolvedParams.locale as Locale);
    });
  }, [params]);

  const isRTL = getDirection(locale) === 'rtl';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, minPrice, maxPrice, inStockOnly, sortBy, locale]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (inStockOnly) params.append('inStockOnly', 'true');
      if (searchQuery) params.append('search', searchQuery);
      params.append('sortBy', sortBy);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    selectedCategory || minPrice || maxPrice || inStockOnly || searchQuery;

  const getPrice = (product: Product) => {
    const variant = product.variants[0];
    if (variant?.priceOverride) {
      return Number(variant.priceOverride);
    }
    return Number(product.basePrice);
  };

  const getStockStatus = (product: Product) => {
    const totalStock = product.variants.reduce(
      (sum, v) => sum + (v.inventory?.quantityOnHand || 0),
      0
    );
    if (totalStock === 0) return 'outOfStock';
    if (totalStock <= 5) return 'lowStock';
    return 'inStock';
  };

  const getProductName = (product: Product) => {
    return locale === 'fr' ? product.nameFr : product.nameAr;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t(locale, 'catalog.title')}
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(locale, 'common.searchPlaceholder')}
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <Search
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  isRTL ? 'right-4' : 'left-4'
                }`}
              />
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {t(locale, 'catalog.filters')}
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    {t(locale, 'catalog.clearFilters')}
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">
                  {t(locale, 'catalog.filterBy')} - {t(locale, 'nav.catalog')}
                </h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {locale === 'fr' ? cat.nameFr : cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">
                  {t(locale, 'catalog.priceRange')}
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                  />
                  <span>{t(locale, 'catalog.inStockOnly')}</span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium mb-3">
                  {t(locale, 'catalog.sortBy')}
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="relevance">
                    {t(locale, 'catalog.sortOptions.relevance')}
                  </option>
                  <option value="newest">
                    {t(locale, 'catalog.sortOptions.newest')}
                  </option>
                  <option value="priceAsc">
                    {t(locale, 'catalog.sortOptions.priceAsc')}
                  </option>
                  <option value="priceDesc">
                    {t(locale, 'catalog.sortOptions.priceDesc')}
                  </option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t(locale, 'catalog.filters')}
              {hasActiveFilters && <X className="w-4 h-4" />}
            </button>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{t(locale, 'common.loading')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{t(locale, 'common.noResults')}</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  {t(locale, 'catalog.showing')} {products.length}{' '}
                  {t(locale, 'catalog.results')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product);
                    const price = getPrice(product);

                    return (
                      <Link
                        key={product.id}
                        href={`/${locale}/produits/${product.slug}`}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                      >
                        <div className="aspect-square bg-gray-200 relative">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].storageKey}
                              alt={
                                locale === 'fr'
                                  ? product.images[0].altFr || getProductName(product)
                                  : product.images[0].altAr || getProductName(product)
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          {stockStatus === 'outOfStock' && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                              {t(locale, 'product.outOfStock')}
                            </div>
                          )}
                          {stockStatus === 'lowStock' && (
                            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                              {t(locale, 'product.lowStock')}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {getProductName(product)}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-amber-600">
                              {price.toFixed(2)} {product.currency}
                            </p>
                            {stockStatus === 'inStock' && (
                              <span className="text-sm text-green-600">
                                {t(locale, 'product.inStock')}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

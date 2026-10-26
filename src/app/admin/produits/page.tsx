import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/helpers';
import Link from 'next/link';

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          nameFr: true,
        }
      },
      variants: {
        include: {
          inventory: true,
        }
      },
      _count: {
        select: {
          variants: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Nouveau produit
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <li className="px-4 py-12 text-center text-gray-500">
              Aucun produit trouvé
            </li>
          ) : (
            products.map((product) => (
              <li key={product.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {product.nameFr}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                          product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status}
                        </span>
                        {product.isFeatured && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Mis en avant
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p className="mr-4">Catégorie: {product.category.nameFr}</p>
                        <p className="mr-4">Prix: {Number(product.basePrice).toFixed(2)} MAD</p>
                        <p>Variantes: {product._count.variants}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/produits/${product.id}/modifier`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Modifier
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                        // onClick={() => handleDelete(product.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

type InventoryItem = {
  id: string;
  variantId: string;
  quantityOnHand: number;
  quantityReserved: number;
  lowStockThreshold: number;
  updatedAt: string;
  variant: {
    id: string;
    sku: string;
    attributes: any;
    product: {
      id: string;
      nameFr: string;
      nameAr: string;
    };
  };
};

type Movement = {
  id: string;
  movementType: string;
  quantityDelta: number;
  reason: string;
  createdAt: string;
};

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [movementForm, setMovementForm] = useState({
    movementType: 'ENTRY',
    quantity: 0,
    reason: '',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async (variantId: string) => {
    try {
      const response = await fetch(`/api/admin/inventory/${variantId}/movements`);
      const data = await response.json();
      setMovements(data);
    } catch (error) {
      console.error('Failed to fetch movements:', error);
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const response = await fetch('/api/admin/inventory/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedItem.variantId,
          movementType: movementForm.movementType,
          quantityDelta: movementForm.movementType === 'ENTRY' || movementForm.movementType === 'RETURN' 
            ? movementForm.quantity 
            : -movementForm.quantity,
          reason: movementForm.reason,
        }),
      });

      if (response.ok) {
        setShowMovementModal(false);
        fetchInventory();
        setMovementForm({ movementType: 'ENTRY', quantity: 0, reason: '' });
      }
    } catch (error) {
      console.error('Failed to add movement:', error);
    }
  };

  const openMovementModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setMovementForm({ movementType: 'ENTRY', quantity: 0, reason: '' });
    fetchMovements(item.variantId);
    setShowMovementModal(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    const available = item.quantityOnHand - item.quantityReserved;
    if (available <= 0) return { color: 'bg-red-100 text-red-800', label: 'Rupture' };
    if (available <= item.lowStockThreshold) return { color: 'bg-yellow-100 text-yellow-800', label: 'Stock faible' };
    return { color: 'bg-green-100 text-green-800', label: 'En stock' };
  };

  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ENTRY: 'Entrée',
      SALE: 'Vente',
      RETURN: 'Retour',
      CORRECTION: 'Correction',
      RESERVATION: 'Réservation',
      RELEASE: 'Libération',
    };
    return labels[type] || type;
  };

  const lowStockItems = inventory.filter(
    item => (item.quantityOnHand - item.quantityReserved) <= item.lowStockThreshold
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des stocks</h1>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-red-800 mb-3">
            Alertes de stock faible ({lowStockItems.length})
          </h3>
          <ul className="divide-y divide-red-200">
            {lowStockItems.slice(0, 5).map((item) => (
              <li key={item.id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      {item.variant.product.nameFr}
                    </p>
                    <p className="text-xs text-red-700">
                      SKU: {item.variant.sku}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-red-900">
                    {item.quantityOnHand - item.quantityReserved} unités
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="px-4 py-12 text-center text-gray-500">
            Chargement...
          </div>
        ) : inventory.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-500">
            Aucun article en stock
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock disponible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réservé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seuil d'alerte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => {
                  const available = item.quantityOnHand - item.quantityReserved;
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.variant.product.nameFr}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.variant.product.nameAr}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.variant.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {available}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantityReserved}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lowStockThreshold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openMovementModal(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Mouvement
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Movement Modal */}
      {showMovementModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Ajouter un mouvement de stock
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedItem.variant.product.nameFr} - {selectedItem.variant.sku}
              </p>
            </div>

            <form onSubmit={handleAddMovement} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de mouvement
                </label>
                <select
                  value={movementForm.movementType}
                  onChange={(e) => setMovementForm({ ...movementForm, movementType: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ENTRY">Entrée de stock</option>
                  <option value="CORRECTION">Correction</option>
                  <option value="RETURN">Retour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantité
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Raison
                </label>
                <input
                  type="text"
                  required
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                  placeholder="Ex: Réception fournisseur, Inventaire, etc."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Recent Movements */}
              {movements.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Mouvements récents</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {movements.slice(0, 5).map((movement) => (
                      <div key={movement.id} className="text-xs py-1">
                        <span className="font-medium">{getMovementTypeLabel(movement.movementType)}</span>
                        <span className="mx-2">{movement.quantityDelta > 0 ? '+' : ''}{movement.quantityDelta}</span>
                        <span className="text-gray-500">- {movement.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowMovementModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddMovement}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

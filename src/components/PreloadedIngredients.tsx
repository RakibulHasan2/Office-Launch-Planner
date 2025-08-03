import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Ingredient, LaunchItem } from '../types';
import { preloadedIngredients } from '../data/preloadedIngredients';

interface PreloadedIngredientsProps {
  onAddToList: (item: LaunchItem) => void;
}

export const PreloadedIngredients: React.FC<PreloadedIngredientsProps> = ({ onAddToList }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (ingredientId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [ingredientId]: quantity
    }));
  };

  const handleAddToList = (ingredient: Ingredient) => {
    const quantity = quantities[ingredient.id] || 1;
    const subtotal = ingredient.price * quantity;

    const launchItem: LaunchItem = {
      id: `${ingredient.id}-${Date.now()}`,
      name: ingredient.name,
      unitPrice: ingredient.price,
      quantity,
      unit: ingredient.unit,
      subtotal
    };

    onAddToList(launchItem);

    // Reset quantity after adding
    setQuantities(prev => ({
      ...prev,
      [ingredient.id]: 0
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Preloaded Ingredients</h2>
          <p className="text-gray-600 text-sm">Quick add common ingredients with fixed prices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {preloadedIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-base">{ingredient.name}</h3>
              <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2 py-1 rounded-lg">৳{ingredient.price}/{ingredient.unit}</span>
            </div>

            <div className="space-y-3">
              <input
                type="number"
                min="0"
                step="0.1"
                value={quantities[ingredient.id] || ''}
                onChange={(e) => handleQuantityChange(ingredient.id, parseFloat(e.target.value) || 0)}
                placeholder="Qty"
                className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <button
                onClick={() => handleAddToList(ingredient)}
                disabled={!quantities[ingredient.id] || quantities[ingredient.id] <= 0}
                className="px-4 w-full  py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {quantities[ingredient.id] && quantities[ingredient.id] > 0 && (
              <div className="mt-3 text-sm font-semibold text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                Subtotal: ৳{(ingredient.price * quantities[ingredient.id]).toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
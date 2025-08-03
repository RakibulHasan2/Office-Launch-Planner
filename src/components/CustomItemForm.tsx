import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { LaunchItem } from '../types';

interface CustomItemFormProps {
  onAddToList: (item: LaunchItem) => void;
}

export const CustomItemForm: React.FC<CustomItemFormProps> = ({ onAddToList }) => {
  const [formData, setFormData] = useState({
    name: '',
    unitPrice: '',
    quantity: '',
    unit: 'kg'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.unitPrice || !formData.quantity) {
      return;
    }

    const unitPrice = parseFloat(formData.unitPrice);
    const quantity = parseFloat(formData.quantity);
    const subtotal = unitPrice * quantity;

    const launchItem: LaunchItem = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      unitPrice,
      quantity,
      unit: formData.unit,
      subtotal
    };

    onAddToList(launchItem);
    
    // Reset form
    setFormData({
      name: '',
      unitPrice: '',
      quantity: '',
      unit: 'kg'
    });
  };

  const subtotal = formData.unitPrice && formData.quantity 
    ? (parseFloat(formData.unitPrice) * parseFloat(formData.quantity)).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-xl">
          <Package className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Custom Item</h2>
          <p className="text-gray-600 text-sm">Create custom ingredients with your own pricing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="itemName" className="block text-sm font-semibold text-gray-700 mb-3">
              Item Name
            </label>
            <input
              id="itemName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="unitPrice" className="block text-sm font-semibold text-gray-700 mb-3">
              Unit Price (৳)
            </label>
            <input
              id="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-3">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="0"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-3">
              Unit
            </label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-gray-50 focus:bg-white"
            >
              <option value="kg">kg</option>
              <option value="liter">liter</option>
              <option value="piece">piece</option>
              <option value="bunch">bunch</option>
              <option value="packet">packet</option>
              <option value="bottle">bottle</option>
            </select>
          </div>
        </div>

        {formData.unitPrice && formData.quantity && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-700">Calculated Subtotal:</span>
              <span className="text-xl font-bold text-green-600">৳{subtotal}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-6 h-6" />
          Add to Launch List
        </button>
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import { Trash2, Edit3, Save, X, FileText } from 'lucide-react';
import { LaunchItem } from '../types';

interface LaunchListProps {
  items: LaunchItem[];
  onUpdateItem: (item: LaunchItem) => void;
  onRemoveItem: (itemId: string) => void;
}

export const LaunchList: React.FC<LaunchListProps> = ({ items, onUpdateItem, onRemoveItem }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<LaunchItem>>({});

  // const totalBudget = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleEditStart = (item: LaunchItem) => {
    setEditingId(item.id);
    setEditData({
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      unit: item.unit
    });
  };

  const handleEditSave = () => {
    if (!editingId || !editData.name || !editData.unitPrice || !editData.quantity) return;

    const updatedItem: LaunchItem = {
      id: editingId,
      name: editData.name,
      unitPrice: editData.unitPrice,
      quantity: editData.quantity,
      unit: editData.unit || 'kg',
      subtotal: editData.unitPrice * editData.quantity
    };

    onUpdateItem(updatedItem);
    setEditingId(null);
    setEditData({});
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Launch List</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items selected</h3>
          <p className="text-gray-500 text-sm">Start adding ingredients to build your launch list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Launch List</h2>
            <p className="text-sm text-blue-600 font-medium">{items.length} item{items.length !== 1 ? 's' : ''} selected</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Item name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editData.unitPrice || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Price"
                    />
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={editData.quantity || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Qty"
                      />
                      <select
                        value={editData.unit || 'kg'}
                        onChange={(e) => setEditData(prev => ({ ...prev, unit: e.target.value }))}
                        className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-green-600">
                      ৳{editData.unitPrice && editData.quantity
                        ? (editData.unitPrice * editData.quantity).toFixed(2)
                        : '0.00'
                      }
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditSave}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>৳{item.unitPrice.toFixed(2)} per {item.unit}</span>
                      <span>×{item.quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600 text-sm">৳{item.subtotal.toFixed(2)}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditStart(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit item"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
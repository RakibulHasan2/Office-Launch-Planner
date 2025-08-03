import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Download, Save } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { PreloadedIngredients } from './components/PreloadedIngredients';
import { CustomItemForm } from './components/CustomItemForm';
import { LaunchList } from './components/LaunchList';
import { Toast } from './components/Toast';
import { LaunchItem, DailyPlan } from './types';
import { saveDailyPlan, getDailyPlan } from './utils/storage';
import { generateInvoicePDF } from './utils/pdfGenerator';

function App() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [items, setItems] = useState<LaunchItem[]>([]);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load data when date changes
  useEffect(() => {
    const savedPlan = getDailyPlan(selectedDate);
    if (savedPlan) {
      setItems(savedPlan.items);
      setNotes(savedPlan.notes || '');
    } else {
      setItems([]);
      setNotes('');
    }
  }, [selectedDate]);

  // Auto-save when items or notes change
  useEffect(() => {
    if (items.length > 0 || notes) {
      const plan: DailyPlan = {
        date: selectedDate,
        items,
        totalBudget: items.reduce((sum, item) => sum + item.subtotal, 0),
        notes
      };
      saveDailyPlan(plan);
    }
  }, [items, notes, selectedDate]);

  const handleAddToList = (item: LaunchItem) => {
    setItems(prev => [...prev, item]);
    setToast({ message: `${item.name} added to launch list`, type: 'success' });
  };

  const handleUpdateItem = (updatedItem: LaunchItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setToast({ message: 'Item updated successfully', type: 'success' });
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = items.find(item => item.id === itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
    if (itemToRemove) {
      setToast({ message: `${itemToRemove.name} removed from list`, type: 'success' });
    }
  };

  const handleDownloadPDF = () => {
    if (items.length === 0) {
      setToast({ message: 'Please add items to the list before downloading', type: 'error' });
      return;
    }

    try {
      const totalBudget = items.reduce((sum, item) => sum + item.subtotal, 0);
      generateInvoicePDF(selectedDate, items, totalBudget, notes);
      setToast({ message: 'Invoice PDF downloaded successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error generating PDF. Please try again.', type: 'error' });
    }
  };

  const totalBudget = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <Dashboard
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          items={items}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Ingredient Selection */}
          <div className="lg:col-span-2 space-y-8">
            <PreloadedIngredients onAddToList={handleAddToList} />
            <CustomItemForm onAddToList={handleAddToList} />
          </div>

          {/* Right Sidebar - Launch List & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6 space-y-6">
              <LaunchList
                items={items}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
              />
              
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Items:</span>
                    <span className="font-semibold text-gray-900">{items.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="font-semibold text-gray-900">{format(new Date(selectedDate), 'dd MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 border border-green-200">
                    <span className="text-green-700 font-bold text-lg">Total Budget:</span>
                    <span className="text-green-600 font-bold text-2xl">৳{totalBudget.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-3">
                      Special Instructions
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any special instructions for the caretaker..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleDownloadPDF}
                    disabled={items.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Download className="w-6 h-6" />
                    Download Invoice PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
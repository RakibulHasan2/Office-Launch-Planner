import React from 'react';
import { Calendar, DollarSign, ShoppingBag, FileText } from 'lucide-react';
import { LaunchItem } from '../types';
import { format } from 'date-fns';

interface DashboardProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  items: LaunchItem[];
}

export const Dashboard: React.FC<DashboardProps> = ({ selectedDate, onDateChange, items }) => {
  const totalBudget = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.length;
  const avgItemCost = totalItems > 0 ? totalBudget / totalItems : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">Daily Office Launch Planner</h1>
          <p className="text-gray-600 text-lg">Plan your daily lunch budget and generate professional shopping lists</p>
        </div>
        
        <div className="flex items-center gap-4 bg-blue-50 px-6 py-4 rounded-xl border border-blue-200">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium"
          />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-semibold mb-1">Selected Date</p>
              <p className="text-blue-900 text-xl font-bold">
                {format(new Date(selectedDate), 'dd MMM yyyy')}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-semibold mb-1">Total Budget</p>
              <p className="text-green-900 text-xl font-bold">৳{totalBudget.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-xl">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-semibold mb-1">Total Items</p>
              <p className="text-purple-900 text-xl font-bold">{totalItems}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-semibold mb-1">Avg. Item Cost</p>
              <p className="text-orange-900 text-xl font-bold">৳{avgItemCost.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-xl">
              <FileText className="w-8 h-8 text-orange-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
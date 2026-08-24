import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, TrendingUp, Package, DollarSign, Users, Star } from 'lucide-react';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [period, setPeriod] = useState('month');

  const stats = [
    { icon: Package, label: 'Products Sold', value: '156', change: '+12%', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: DollarSign, label: 'Revenue', value: '₹24,500', change: '+18%', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Users, label: 'Customers', value: '89', change: '+8%', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Star, label: 'Avg Rating', value: '4.5/5', change: '+0.2', color: 'text-yellow-600', bg: 'bg-yellow-100' }
  ];

  const topProducts = [
    { name: 'Fresh Tomatoes', sold: 45, revenue: 1800, trend: '+25%' },
    { name: 'Organic Spinach', sold: 32, revenue: 960, trend: '+15%' },
    { name: 'Fresh Mangoes', sold: 28, revenue: 2240, trend: '+10%' },
    { name: 'Farm Eggs', sold: 25, revenue: 150, trend: '+5%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/farmer/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('analytics')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Period Filter */}
        <div className="flex space-x-2 mb-6">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            Sales Overview
          </h2>
          <div className="h-48 bg-gradient-to-b from-green-50 to-white rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">Sales chart will appear here</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Top Selling Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center font-bold text-green-600">
                        {index + 1}
                      </span>
                      <span className="font-bold">{product.name}</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium">{product.trend}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{product.sold} units sold</span>
                    <span className="font-medium">₹{product.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(product.sold / 45) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
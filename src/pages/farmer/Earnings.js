import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, DollarSign, TrendingUp, Wallet, Calendar, Download } from 'lucide-react';

const EarningsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [period, setPeriod] = useState('month');

  const earnings = [
    { id: '1', date: '2026-08-22', orderId: 'FB-2026-001', amount: 110, status: 'completed' },
    { id: '2', date: '2026-08-22', orderId: 'FB-2026-002', amount: 200, status: 'completed' },
    { id: '3', date: '2026-08-21', orderId: 'FB-2026-003', amount: 90, status: 'completed' },
    { id: '4', date: '2026-08-20', orderId: 'FB-2026-004', amount: 350, status: 'pending' },
    { id: '5', date: '2026-08-19', orderId: 'FB-2026-005', amount: 150, status: 'completed' },
  ];

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const completedEarnings = earnings.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/farmer/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('earnings')}</h1>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-green-600">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</h3>
            <p className="text-gray-500">Total Earnings</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{completedEarnings.toLocaleString()}</h3>
            <p className="text-gray-500">Available Balance</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">+15%</h3>
            <p className="text-gray-500">Growth vs Last Month</p>
          </div>
        </div>

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

        {/* Earnings List */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Transaction History</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {earnings.map((earning) => (
                <div key={earning.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold">#{earning.orderId}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          earning.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {earning.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(earning.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">₹{earning.amount}</div>
                    </div>
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

export default EarningsPage;
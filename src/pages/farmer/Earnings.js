import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, DollarSign, TrendingUp, Wallet, Calendar, 
  Download, TrendingDown, PiggyBank, ArrowUpCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const EarningsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [period, setPeriod] = useState('month');

  const transactions = [
    { id: '1', date: '2026-08-22', orderId: 'FB-2026-001', amount: 110, cost: 70, type: 'sale', status: 'completed' },
    { id: '2', date: '2026-08-22', orderId: 'FB-2026-002', amount: 200, cost: 120, type: 'sale', status: 'completed' },
    { id: '3', date: '2026-08-21', orderId: 'FB-2026-003', amount: 90, cost: 50, type: 'sale', status: 'completed' },
    { id: '4', date: '2026-08-20', orderId: 'FB-2026-004', amount: 350, cost: 200, type: 'sale', status: 'pending' },
    { id: '5', date: '2026-08-19', orderId: 'FB-2026-005', amount: 60, cost: 80, type: 'loss', status: 'completed' },
  ];

  const totalRevenue = transactions.reduce((sum, e) => sum + e.amount, 0);
  const totalCost = transactions.reduce((sum, e) => sum + e.cost, 0);
  const netProfit = totalRevenue - totalCost;
  const totalLoss = transactions.filter(e => e.amount < e.cost).reduce((sum, e) => sum + (e.cost - e.amount), 0);
  const completedEarnings = transactions.filter(e => e.status === 'completed' && e.amount > e.cost).reduce((sum, e) => sum + (e.amount - e.cost), 0);

  const stats = [
    { label: 'Total Earnings', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Net Profit', value: `₹${netProfit.toLocaleString()}`, icon: PiggyBank, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Profit', value: `₹${(totalRevenue - totalLoss).toLocaleString()}`, icon: ArrowUpCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Loss', value: `-₹${totalLoss.toLocaleString()}`, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const handleEnter = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      toast.success('Earnings page refreshed');
    }
  };

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
          <button onClick={() => toast.success('Downloaded earnings report')} className="p-2 rounded-lg hover:bg-gray-100 text-green-600">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 lg:p-6" onKeyDown={handleEnter}>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bg} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
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

        {/* Profit/Loss Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Wallet className="h-5 w-5 text-blue-600 mr-2" />
              Available Balance
            </h2>
            <div className="text-4xl font-bold text-green-600 mb-2">₹{completedEarnings.toLocaleString()}</div>
            <p className="text-gray-500">Ready for withdrawal</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              Growth
            </h2>
            <div className="text-4xl font-bold text-purple-600 mb-2">+15%</div>
            <p className="text-gray-500">{t('growth')}</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">{t('transactionHistory')}</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {transactions.map((trx) => {
                const profit = trx.amount - trx.cost;
                const isProfit = profit >= 0;
                return (
                  <div key={trx.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-bold">#{trx.orderId}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {trx.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isProfit ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {isProfit ? 'Profit' : 'Loss'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {trx.date}
                          <span className="mx-2">•</span>
                          Cost: ₹{trx.cost}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                          {isProfit ? '+' : '-'}₹{Math.abs(profit).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Revenue: ₹{trx.amount}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
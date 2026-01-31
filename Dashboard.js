import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Menu, User, Package, Truck, DollarSign, Star, 
  Bell, Plus, TrendingUp, Calendar, MapPin,
  BarChart, ShoppingBag, CreditCard, MessageSquare
} from 'lucide-react';
import api from '../../services/api';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalProducts: 0,
    monthlyEarnings: 0,
    averageRating: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch farmer stats
      const statsResponse = await api.get('/farmer/dashboard/stats');
      setStats(statsResponse.data);
      
      // Fetch recent orders
      const ordersResponse = await api.get('/farmer/orders/recent');
      setRecentOrders(ordersResponse.data.orders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const menuItems = [
    { icon: Package, label: t('products'), path: '/farmer/products' },
    { icon: ShoppingBag, label: t('orders'), path: '/farmer/orders' },
    { icon: DollarSign, label: t('earnings'), path: '/farmer/earnings' },
    { icon: BarChart, label: t('analytics'), path: '/farmer/analytics' },
    { icon: User, label: t('profile'), path: '/farmer/profile' },
    { icon: MessageSquare, label: t('messages'), path: '/farmer/messages' },
    { icon: CreditCard, label: t('bankDetails'), path: '/farmer/bank' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={() => navigate('/farmer/profile')}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
              )}
              <span className="font-medium hidden sm:block">{user?.name || 'Farmer'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Menu */}
        <div className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:block
        `}>
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Farm Bridge</h3>
                <p className="text-sm text-gray-500">{t('farmerDashboard')}</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 text-left"
                  >
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 lg:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</h3>
              <p className="text-gray-500">{t('pendingOrders')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
              <p className="text-gray-500">{t('activeProducts')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">₹{stats.monthlyEarnings.toLocaleString()}</h3>
              <p className="text-gray-500">{t('monthlyEarnings')}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</h3>
              <p className="text-gray-500">{t('customerRating')}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow mb-6 p-6">
            <h2 className="text-xl font-bold mb-4">{t('quickActions')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/farmer/products/new')}
                className="p-4 border-2 border-dashed border-green-300 rounded-xl hover:bg-green-50 flex flex-col items-center"
              >
                <Plus className="h-8 w-8 text-green-600 mb-2" />
                <span className="font-medium">{t('addProduct')}</span>
              </button>
              
              <button
                onClick={() => navigate('/farmer/orders')}
                className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 flex flex-col items-center"
              >
                <ShoppingBag className="h-8 w-8 text-blue-600 mb-2" />
                <span className="font-medium">{t('viewOrders')}</span>
              </button>
              
              <button
                onClick={() => navigate('/farmer/analytics')}
                className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 flex flex-col items-center"
              >
                <BarChart className="h-8 w-8 text-purple-600 mb-2" />
                <span className="font-medium">{t('viewAnalytics')}</span>
              </button>
              
              <button
                onClick={() => navigate('/farmer/messages')}
                className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 flex flex-col items-center"
              >
                <MessageSquare className="h-8 w-8 text-orange-600 mb-2" />
                <span className="font-medium">{t('messages')}</span>
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t('recentOrders')}</h2>
                <button
                  onClick={() => navigate('/farmer/orders')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t('viewAll')}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t('noOrdersYet')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/farmer/orders/${order._id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-bold">#{order.orderId}</span>
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'}
                            `}>
                              {t(order.status)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ₹{order.totalAmount}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg">₹{order.totalAmount}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {order.deliveryAddress?.pincode}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
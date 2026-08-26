import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { 
  Menu, User, ShoppingCart, Bell, Search, 
  MapPin, Star, Package, Truck, DollarSign, 
  Bot, Leaf, Clock, Filter
} from 'lucide-react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getProductImage } from '../../utils/productImages';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addToCart, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Demo products data
    setProducts([
      {
        _id: '1',
        name: 'Fresh Tomatoes',
        farmer: 'Ramesh Kumar',
        price: 40,
        unit: 'kg',
        rating: 4.5,
        distance: 2.3,
        freshness: 'justHarvested',
        image: '🍅',
        organic: true,
        category: 'vegetables',
        quality: 'Premium',
        stock: 50
      },
      {
        _id: '2',
        name: 'Organic Spinach',
        farmer: 'Suresh Patel',
        price: 30,
        unit: 'kg',
        rating: 4.8,
        distance: 3.1,
        freshness: 'veryFresh',
        image: '🥬',
        organic: true,
        category: 'vegetables',
        quality: 'Premium',
        stock: 20
      },
      {
        _id: '3',
        name: 'Fresh Mangoes',
        farmer: 'Lakshmi Devi',
        price: 80,
        unit: 'kg',
        rating: 4.2,
        distance: 1.8,
        freshness: 'fresh',
        image: '🥭',
        organic: false,
        category: 'fruits',
        quality: 'Standard',
        stock: 30
      },
      {
        _id: '4',
        name: 'Farm Eggs',
        farmer: 'Venkatesh Rao',
        price: 6,
        unit: 'piece',
        rating: 4.6,
        distance: 4.2,
        freshness: 'veryFresh',
        image: '🥚',
        organic: false,
        category: 'poultry',
        quality: 'Premium',
        stock: 100
      },
      {
        _id: '5',
        name: 'Organic Rice',
        farmer: 'Krishna Reddy',
        price: 60,
        unit: 'kg',
        rating: 4.4,
        distance: 5.5,
        freshness: 'fresh',
        image: '🍚',
        organic: true,
        category: 'grains',
        quality: 'Standard',
        stock: 80
      },
      {
        _id: '6',
        name: 'Fresh Milk',
        farmer: 'Mohan Das',
        price: 55,
        unit: 'liter',
        rating: 4.9,
        distance: 2.8,
        freshness: 'justHarvested',
        image: '🥛',
        organic: false,
        category: 'dairy',
        quality: 'Premium',
        stock: 40
      }
    ]);
  }, []);

  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'poultry', 'spices'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const getFreshnessLabel = (freshness) => {
    switch (freshness) {
      case 'justHarvested': return t('justHarvested');
      case 'veryFresh': return t('veryFresh');
      case 'fresh': return t('fresh');
      default: return t('moderate');
    }
  };

  const getFreshnessColor = (freshness) => {
    switch (freshness) {
      case 'justHarvested': return 'bg-green-100 text-green-800';
      case 'veryFresh': return 'bg-emerald-100 text-emerald-800';
      case 'fresh': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const menuItems = [
    { icon: Package, label: t('products'), path: '/buyer/products' },
    { icon: ShoppingCart, label: t('cart'), path: '/buyer/cart' },
    { icon: Truck, label: t('orders'), path: '/buyer/orders' },
    { icon: User, label: t('profile'), path: '/buyer/profile' },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Full-page background image */}
      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=50"
        alt="Fresh produce background"
        className="fixed inset-0 w-full h-full object-cover"
      />
      <div className="fixed inset-0 bg-gradient-to-b from-orange-900/30 via-white/70 to-orange-900/30"></div>

      <div className="relative z-10">
      {/* Top Navigation */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-200"
            title="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          
          <div className="flex items-center space-x-3 text-gray-800">
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/buyer/cart')}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={() => navigate('/buyer/profile')}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
              )}
              <span className="font-medium hidden sm:block">{user?.name || 'Buyer'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Mobile overlay when menu open */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-15 bg-black/40 lg:hidden" onClick={() => setIsMenuOpen(false)}></div>
        )}

        {/* Sidebar Menu - toggles open/close on all screen sizes */}
        <aside className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-2xl transform transition-transform duration-300
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Farm Bridge</h3>
                <p className="text-sm text-gray-500">{t('buyerDashboard')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-200"
              title="Close menu"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
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
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 text-left"
                  >
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-grow p-4 lg:p-6">
          {/* Welcome Banner */}
          <div className="relative rounded-2xl p-6 mb-6 text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh farm produce"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-amber-700/60"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Buyer'}! 🛒</h2>
              <p className="opacity-90">Fresh produce from nearby farms, delivered to you</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchFarmersProducts')}
                className="flex-grow outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors
                  ${category === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {cat === 'all' ? t('all') : t(cat)}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <h2 className="text-xl font-bold mb-4">{t('freshProduceNearYou')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://img.icons8.com/color/240/000000/vegetables.png'; }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.distance} km
                    <span className="mx-2">•</span>
                    {product.farmer}
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFreshnessColor(product.freshness)}`}>
                      {getFreshnessLabel(product.freshness)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(product.quality)}`}>
                      <Bot className="h-3 w-3 inline mr-1" />
                      {product.quality}
                    </span>
                    {product.organic && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <Leaf className="h-3 w-3 inline mr-1" />
                        {t('organicOnly')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                      <span className="text-gray-500 text-sm"> /{product.unit}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {t('stock')}: {product.stock}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${product.name} added to cart!`);
                    }}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                  >
                    {t('addToCart')}
                  </button>
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

export default BuyerDashboard;
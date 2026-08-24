import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Search, Star, MapPin, ShoppingCart, Filter } from 'lucide-react';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addToCart, cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
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
        stock: 40
      }
    ]);
  }, []);

  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'poultry', 'spices'];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'rating': return b.rating - a.rating;
        case 'distance': return a.distance - b.distance;
        default: return 0;
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/buyer/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('products')}</h1>
          </div>
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
        </div>
      </div>

      <div className="p-4 lg:p-6">
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
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
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

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            <span className="text-sm">{t('sortBy')}:</span>
          </div>
          <div className="flex space-x-2">
            {['distance', 'price', 'rating'].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-colors
                  ${sortBy === sort
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-500 hover:bg-gray-100'
                  }
                `}
              >
                {t(sort)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center text-6xl">
                {product.image}
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
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFreshnessColor(product.freshness)}`}>
                    {getFreshnessLabel(product.freshness)}
                  </span>
                  {product.organic && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
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
                    {t('stock')}: {product.stock} {product.unit}
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
  );
};

export default ProductCatalog;
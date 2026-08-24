import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ShoppingBag, MapPin, Calendar, Truck, Package, CheckCircle } from 'lucide-react';

const BuyerOrdersPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const orders = [
    {
      _id: '1',
      orderId: 'FB-2026-001',
      items: [
        { name: 'Fresh Tomatoes', quantity: 2, price: 40, unit: 'kg' },
        { name: 'Organic Spinach', quantity: 1, price: 30, unit: 'kg' }
      ],
      totalAmount: 110,
      status: 'delivered',
      createdAt: '2026-08-22T10:30:00',
      farmer: 'Ramesh Kumar',
      deliveryAddress: { pincode: '560001', address: 'MG Road, Bangalore' }
    },
    {
      _id: '2',
      orderId: 'FB-2026-002',
      items: [
        { name: 'Fresh Mangoes', quantity: 3, price: 80, unit: 'kg' }
      ],
      totalAmount: 240,
      status: 'in_transit',
      createdAt: '2026-08-22T09:15:00',
      farmer: 'Lakshmi Devi',
      deliveryAddress: { pincode: '560034', address: 'Indiranagar, Bangalore' }
    },
    {
      _id: '3',
      orderId: 'FB-2026-003',
      items: [
        { name: 'Farm Eggs', quantity: 12, price: 6, unit: 'piece' }
      ],
      totalAmount: 72,
      status: 'pending',
      createdAt: '2026-08-21T14:00:00',
      farmer: 'Venkatesh Rao',
      deliveryAddress: { pincode: '560095', address: 'HSR Layout, Bangalore' }
    }
  ];

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/buyer/dashboard')} className="p-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('orders')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {['all', 'pending', 'in_transit', 'delivered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t(f)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('noOrdersYet')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-bold text-lg">#{order.orderId}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {t(order.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.farmer} • {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-orange-600">₹{order.totalAmount}</div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} {item.unit} × ₹{item.price}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">₹{item.quantity * item.price}</div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {order.deliveryAddress.address} - {order.deliveryAddress.pincode}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {order.status === 'in_transit' && (
                    <button
                      onClick={() => navigate(`/tracking/${order._id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Truck className="h-4 w-4" />
                      <span>{t('trackOrder')}</span>
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => navigate(`/tracking/${order._id}`)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{t('trackOrder')}</span>
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => navigate('/buyer/cart')}
                      className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                    >
                      {t('checkout')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrdersPage;
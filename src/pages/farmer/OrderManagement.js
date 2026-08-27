import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useSocket, SOCKET_EVENTS } from '../../context/SocketContext';
import { ArrowLeft, ShoppingBag, MapPin, Calendar, DollarSign, Truck } from 'lucide-react';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { on, off } = useSocket();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Demo orders data
    setOrders([
      {
        _id: '1',
        orderId: 'FB-2026-001',
        customerName: 'Rahul Sharma',
        items: [
          { name: 'Fresh Tomatoes', quantity: 2, price: 40, unit: 'kg' },
          { name: 'Organic Spinach', quantity: 1, price: 30, unit: 'kg' }
        ],
        totalAmount: 110,
        status: 'pending',
        createdAt: '2026-08-22T10:30:00',
        deliveryAddress: { pincode: '560001', address: 'MG Road, Bangalore' }
      },
      {
        _id: '2',
        orderId: 'FB-2026-002',
        customerName: 'Priya Patel',
        items: [
          { name: 'Fresh Tomatoes', quantity: 5, price: 40, unit: 'kg' }
        ],
        totalAmount: 200,
        status: 'in_transit',
        createdAt: '2026-08-22T09:15:00',
        deliveryAddress: { pincode: '560034', address: 'Indiranagar, Bangalore' }
      },
      {
        _id: '3',
        orderId: 'FB-2026-003',
        customerName: 'Amit Kumar',
        items: [
          { name: 'Organic Spinach', quantity: 3, price: 30, unit: 'kg' }
        ],
        totalAmount: 90,
        status: 'delivered',
        createdAt: '2026-08-21T14:00:00',
        deliveryAddress: { pincode: '560095', address: 'HSR Layout, Bangalore' }
      }
    ]);
  }, []);

  // Live status updates from the socket – patch orders in place so the list
  // reflects changes made elsewhere (e.g. by the buyer/admin) without a refresh.
  useEffect(() => {
    const handleStatusUpdate = (order = {}) => {
      const id = order?._id || order?.orderId;
      if (!id) return;
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id || o.orderId === id
            ? { ...o, status: order?.status || o.status }
            : o
        )
      );
    };

    on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleStatusUpdate);

    return () => {
      off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleStatusUpdate);
    };
  }, [on, off]);

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

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('orders')}</h1>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {['all', 'pending', 'in_transit', 'delivered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }
              `}
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
                      {order.customerName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-green-600">₹{order.totalAmount}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-end">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-green-600" />
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

                {/* Status Actions */}
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(order._id, 'in_transit')}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                      >
                        <Truck className="h-4 w-4" />
                        <span>Start Delivery</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(order._id, 'cancelled')}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100"
                      >
                        {t('cancelled')}
                      </button>
                    </>
                  )}
                  {order.status === 'in_transit' && (
                    <button
                      onClick={() => handleStatusChange(order._id, 'delivered')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      {t('orderDelivered')}
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => navigate(`/tracking/${order._id}`)}
                      className="flex-1 bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100"
                    >
                      {t('trackOrder')}
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

export default OrderManagement;
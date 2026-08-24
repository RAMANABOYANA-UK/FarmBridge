import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryAddress, setDeliveryAddress] = useState('MG Road, Bangalore - 560001');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartTotal;
  const deliveryFee = subtotal > 200 ? 0 : 30;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
    toast.success(t('orderConfirmation'));
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('orderConfirmation')}</h1>
          <p className="text-gray-600 mb-6">
            Order #FB-2026-004 has been placed successfully!
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t('total')}</span>
              <span className="font-bold">₹{total}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{t('paymentMethods')}</span>
              <span className="font-medium">{t(paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('deliveryAddress')}</span>
              <span className="font-medium text-right">{deliveryAddress}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/buyer/dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200"
            >
              {t('continue')}
            </button>
            <button
              onClick={() => navigate('/tracking/4')}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
            >
              {t('trackOrder')}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold">{t('cart')}</h1>
          </div>
          <div className="flex items-center text-gray-600">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="font-medium">{cartItems.length} items</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some fresh produce to get started</p>
            <button
              onClick={() => navigate('/buyer/products')}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
            >
              {t('browseFiles')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center text-4xl mr-4">
                      {item.image}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.farmer}</p>
                      <div className="text-green-600 font-bold mt-1">
                        ₹{item.price} <span className="text-gray-500 text-sm font-normal">/{item.unit}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="font-bold">₹{item.price * item.quantity}</div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold mb-4">{t('orderSummary')}</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">{t('total')}</span>
                    <span className="font-bold text-green-600">₹{total}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('deliveryAddress')}
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="flex-grow outline-none"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('paymentMethods')}
                  </label>
                  <div className="space-y-2">
                    {['upi', 'cashOnDelivery', 'bankTransfer'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-xl border-2 transition-colors
                          ${paymentMethod === method
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                          <span>{t(method)}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === method ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                          {paymentMethod === method && (
                            <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 font-semibold"
                >
                  {t('placeOrder')} • ₹{total}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useSocket, SOCKET_EVENTS } from '../../context/SocketContext';
import { ArrowLeft, MapPin, Truck, Package, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';

const TrackingPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { t } = useLanguage();
  const { joinOrder, leaveOrder, on, off, isConnected } = useSocket();
  const [trackingStatus, setTrackingStatus] = useState('in_transit');
  const [currentLocation, setCurrentLocation] = useState('Koramangala, Bangalore');
  const [estimatedDelivery, setEstimatedDelivery] = useState('Today, 6:00 PM');

  // Map backend order statuses onto the fixed timeline steps
  const mapStatusToStep = (status) => {
    if (status === 'delivered') return 'delivered';
    if (status === 'in_transit' || status === 'out_for_delivery') return 'in_transit';
    return 'confirmed'; // pending / confirmed / others
  };

  // Subscribe to live order updates for this specific order room
  useEffect(() => {
    joinOrder(orderId);

    const handleStatusUpdate = (order = {}) => {
      if (order?.status) {
        setTrackingStatus(order.status);
      }
    };

    on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleStatusUpdate);
    on(SOCKET_EVENTS.PAYMENT_RECEIVED, handleStatusUpdate);

    return () => {
      leaveOrder(orderId);
      off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleStatusUpdate);
      off(SOCKET_EVENTS.PAYMENT_RECEIVED, handleStatusUpdate);
    };
  }, [orderId, joinOrder, leaveOrder, on, off]);

  const trackingSteps = [
    { id: 'confirmed', label: t('confirmed'), icon: CheckCircle, time: '10:30 AM' },
    { id: 'in_transit', label: t('in_transit'), icon: Truck, time: '2:15 PM' },
    { id: 'delivered', label: t('delivered'), icon: Package, time: 'Expected 6:00 PM' }
  ];

  const getStepStatus = (stepId) => {
    const order = ['confirmed', 'in_transit', 'delivered'];
    const currentIndex = order.indexOf(mapStatusToStep(trackingStatus));
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold">{t('orderTracking')}</h1>
          </div>
          {isConnected ? (
            <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Wifi className="h-3 w-3 mr-1" /> Live
            </span>
          ) : (
            <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              <WifiOff className="h-3 w-3 mr-1" /> Offline
            </span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 lg:p-6">
        {/* Order Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">Order #{orderId}</h2>
              <p className="text-sm text-gray-500">FB-2026-00{orderId}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
              {trackingStatus.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">{t('currentLocation')}</div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-green-600 mr-2" />
                <span className="font-medium">{currentLocation}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">{t('estimatedDelivery')}</div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-orange-500 mr-2" />
                <span className="font-medium">{estimatedDelivery}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-6">{t('trackingHistory')}</h2>
          <div className="space-y-0">
            {trackingSteps.map((step, index) => {
              const status = getStepStatus(step.id);
              return (
                <div key={step.id} className="flex">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center mr-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${status === 'completed' ? 'bg-green-500 text-white' :
                        status === 'current' ? 'bg-blue-500 text-white' :
                        'bg-gray-200 text-gray-400'}
                    `}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`w-0.5 flex-grow ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="pb-8">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold ${status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {step.label}
                      </h3>
                      {status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className={`text-sm ${status === 'pending' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.time}
                    </p>
                    {status === 'current' && (
                      <p className="text-sm text-blue-600 mt-1">
                        {t('liveTracking')} - {currentLocation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-lg font-bold mb-4">{t('liveTracking')}</h2>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-600 mb-2">
              Live map tracking is available
            </p>
            <p className="text-sm text-gray-500">
              Delivery partner is on the way to your location
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              Live Tracking Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSocket } from '../context/SocketContext';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ orderId, farmerLocation, buyerLocation, showRoute = true }) => {
  const [position, setPosition] = useState(farmerLocation || [12.9716, 77.5946]); // Default to Bangalore
  const [trackingHistory, setTrackingHistory] = useState([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (orderId && socket) {
      // Join the order room for real-time tracking
      socket.emit('join-order', orderId);
      
      // Listen for location updates
      socket.on('location-updated', (data) => {
        if (data.orderId === orderId) {
          setPosition([data.location.latitude, data.location.longitude]);
          setTrackingHistory(prev => [...prev, data.location]);
        }
      });
      
      return () => {
        socket.off('location-updated');
      };
    }
  }, [orderId, socket]);

  // Create polyline for tracking history
  const polyline = trackingHistory.length > 1 
    ? trackingHistory.map(loc => [loc.latitude, loc.longitude])
    : [];

  // Custom icons
  const farmerIcon = L.divIcon({
    className: 'custom-farmer-icon',
    html: '<div class="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><span class="text-white text-xs">🚜</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const buyerIcon = L.divIcon({
    className: 'custom-buyer-icon',
    html: '<div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><span class="text-white text-xs">🏠</span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const deliveryIcon = L.divIcon({
    className: 'custom-delivery-icon',
    html: '<div class="w-10 h-10 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><span class="text-white text-sm">📦</span></div>',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return (
    <div className="h-full w-full">
      <MapContainer
        center={position}
        zoom={13}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Farmer Marker */}
        {farmerLocation && (
          <Marker position={farmerLocation} icon={farmerIcon}>
            <Popup>
              <div className="font-bold">Farmer Location</div>
              <div>Order ID: {orderId}</div>
              <div className="text-sm text-gray-600">
                Live updates: {isConnected ? 'Active' : 'Connecting...'}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Buyer Marker */}
        {buyerLocation && (
          <Marker position={buyerLocation} icon={buyerIcon}>
            <Popup>
              <div className="font-bold">Delivery Address</div>
              <div>Order ID: {orderId}</div>
            </Popup>
          </Marker>
        )}
        
        {/* Current Delivery Position */}
        <Marker position={position} icon={deliveryIcon}>
          <Popup>
            <div className="font-bold">Delivery Status</div>
            <div>Order ID: {orderId}</div>
            <div className="text-sm">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </Popup>
        </Marker>
        
        {/* Route Line */}
        {showRoute && farmerLocation && buyerLocation && (
          <Polyline
            positions={[farmerLocation, position, buyerLocation]}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
        
        {/* Tracking History */}
        {polyline.length > 1 && (
          <Polyline
            positions={polyline}
            color="#10b981"
            weight={2}
            opacity={0.5}
          />
        )}
      </MapContainer>
      
      {/* Connection Status */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {isConnected ? 'Live Tracking Active' : 'Connecting...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
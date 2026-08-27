import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Event names used by the FarmBridge backend
export const SOCKET_EVENTS = {
  NEW_ORDER: 'new_order',
  ORDER_STATUS_UPDATED: 'order_status_updated',
  ORDER_STATUS: 'order_status', // legacy backend event kept for compatibility
  PAYMENT_RECEIVED: 'payment_received',
  NEW_MESSAGE: 'new_message',
  MESSAGE_NOTIFICATION: 'message_notification',
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect once we have an authenticated user.
    // If the user logs out, tear down the socket entirely.
    if (!token || !user?.id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return undefined;
    }

    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token }, // JWT sent in handshake; verified best-effort by backend
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('[Socket] connected:', socket.id);
      setIsConnected(true);

      // Every user gets a personal room, plus their role room so targeted
      // events like `new_order`, `payment_received` etc. arrive reliably.
      socket.emit('join_user', user.id);
      if (user.role === 'farmer') socket.emit('join_farmer', user.id);
      if (user.role === 'buyer') socket.emit('join_buyer', user.id);
    };

    const handleDisconnect = (reason) => {
      console.log('[Socket] disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (err) => {
      console.error('[Socket] connection error:', err.message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // ---------- Global toast notifications ----------
    const handleNewOrder = (order = {}) => {
      if (user.role !== 'farmer') return;
      const id = order?.orderId || order?._id || '';
      toast.info(`🚜 New order received${id ? ` #${id}` : ''}`);
    };

    const handleOrderStatus = (order = {}) => {
      const status = order?.status;
      const id = order?.orderId || order?._id || '';
      if (status) {
        toast.info(`📦 Order${id ? ` #${id}` : ''} is now ${status}`);
      }
    };

    const handlePayment = (order = {}) => {
      const id = order?.orderId || order?._id || '';
      toast.success(`💰 Payment received${id ? ` for order #${id}` : ''}`);
    };

    socket.on(SOCKET_EVENTS.NEW_ORDER, handleNewOrder);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleOrderStatus);
    socket.on(SOCKET_EVENTS.PAYMENT_RECEIVED, handlePayment);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off(SOCKET_EVENTS.NEW_ORDER, handleNewOrder);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleOrderStatus);
      socket.off(SOCKET_EVENTS.PAYMENT_RECEIVED, handlePayment);
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token, user]);

  // Join/leave a specific order room to receive order-targeted events
  const joinOrder = (orderId) => {
    if (socketRef.current && orderId) {
      socketRef.current.emit('join_order', orderId);
    }
  };

  const leaveOrder = (orderId) => {
    if (socketRef.current && orderId) {
      socketRef.current.emit('leave_order', orderId);
    }
  };

  // Register/remove a listener for any event (works on the live socket)
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        joinOrder,
        leaveOrder,
        on,
        off,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

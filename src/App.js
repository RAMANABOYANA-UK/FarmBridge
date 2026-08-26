import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import LanguageSelect from './pages/LanguageSelect';
import RoleSelect from './pages/RoleSelect';
import FarmerDashboard from './pages/farmer/Dashboard';
import BuyerDashboard from './pages/buyer/Dashboard';
import FarmerProfile from './pages/farmer/Profile';
import BuyerProfile from './pages/buyer/Profile';
import ProductListing from './pages/farmer/ProductListing';
import ProductCatalog from './pages/buyer/ProductCatalog';
import OrderManagement from './pages/farmer/OrderManagement';
import CartPage from './pages/buyer/CartPage';
import TrackingPage from './pages/shared/TrackingPage';
import EarningsPage from './pages/farmer/Earnings';
import MessagesPage from './pages/shared/Messages';
import BankDetailsPage from './pages/farmer/BankDetails';
import AnalyticsPage from './pages/farmer/Analytics';
import BuyerOrdersPage from './pages/buyer/Orders';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <SocketProvider>
            <CartProvider>
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
              <Routes>
                <Route path="/" element={<LanguageSelect />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/language" element={<LanguageSelect />} />
                <Route path="/role" element={<RoleSelect />} />
                
                {/* Farmer Routes */}
                <Route path="/farmer/dashboard" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/profile" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <FarmerProfile />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/products" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <ProductListing />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/products/new" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <ProductListing />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/orders" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <OrderManagement />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/earnings" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <EarningsPage />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/analytics" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/messages" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <MessagesPage />
                  </ProtectedRoute>
                } />
                <Route path="/farmer/bank" element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <BankDetailsPage />
                  </ProtectedRoute>
                } />
                
                {/* Buyer Routes */}
                <Route path="/buyer/dashboard" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/profile" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerProfile />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/products" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <ProductCatalog />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/cart" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/orders" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerOrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/buyer/messages" element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <MessagesPage />
                  </ProtectedRoute>
                } />
                
                {/* Shared Routes */}
                <Route path="/tracking/:orderId" element={
                  <ProtectedRoute>
                    <TrackingPage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <ToastContainer position="bottom-right" />
            </div>
            </CartProvider>
          </SocketProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
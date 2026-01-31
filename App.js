import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
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

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
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
              <Route path="/farmer/orders" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <OrderManagement />
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
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
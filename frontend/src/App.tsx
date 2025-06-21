import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Category } from './pages/Category';
import { Cart } from './pages/Cart';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { Favorites } from './pages/Favorites';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Shipping } from './pages/Shipping';
import { Returns } from './pages/Returns';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Cookies } from './pages/Cookies';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';

// Admin components
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/Products/AdminProducts';
import AdminProductForm from './pages/Admin/Products/AdminProductForm';
import AdminCategories from './pages/Admin/Categories/AdminCategories';
import AdminCategoryForm from './pages/Admin/Categories/AdminCategoryForm';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import AdminUserForm from './pages/Admin/Users/AdminUserForm';
import AdminOrders from './pages/Admin/Orders/AdminOrders';

import './App.css';

function AppContent() {
  return (
    <Routes>
      {/* Admin Routes - Tam ekran layout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<AdminCategoryForm />} />
        <Route path="categories/edit/:id" element={<AdminCategoryForm />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/edit/:id" element={<AdminUserForm />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* Normal Routes - Header/Footer ile */}
      <Route path="*" element={
        <div className="min-h-screen w-screen bg-gray-50 flex flex-col overflow-x-hidden">
          <Header />
          <main className="flex-1 relative w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/category/:categoryId" element={<Category />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

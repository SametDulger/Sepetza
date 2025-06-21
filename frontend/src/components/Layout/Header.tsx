import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastContext } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import { cartService } from '../../services/api';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { showWarning } = useToastContext();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCartCount();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleCartUpdate = () => {
      if (isAuthenticated) {
        loadCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isAuthenticated]);



  const loadCartCount = async () => {
    try {
      const response = await cartService.getItems();
      const cartItems = response.data || [];
      // Toplam quantity'yi hesapla (aynı üründen birden fazla varsa)
      const totalQuantity = cartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
      setCartItemCount(totalQuantity);
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartItemCount(0);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      if (searchValue.trim().length >= 2) {
        navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      } else if (searchValue.trim().length === 0) {
        // Arama terimi boşsa tüm ürünlere git
        navigate('/products');
      }
    }, 500),
    [navigate]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    
    if (trimmedSearch.length < 2) {
      showWarning('Arama Uyarısı', 'Arama terimi en az 2 karakter olmalıdır');
      return;
    }
    
    if (trimmedSearch) {
      navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);
      setIsMenuOpen(false); // Mobil menüyü kapat
    }
  };

// Debounce utility function
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300",
        isScrolled ? "shadow-lg border-gray-200/50" : "shadow-sm border-gray-200"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
              <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
                <div className="flex items-center h-16">
          {/* Left Section - Logo */}
          <motion.div 
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center group">
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-900 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                Sepetza
              </motion.span>
            </Link>
          </motion.div>

          {/* Center Section - Search Bar + Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center ml-16">
            {/* Search Bar */}
            <div className="max-w-2xl w-full">
              <motion.form 
                onSubmit={handleSearch} 
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Ürün, marka veya kategori ara..."
                  className={cn(
                    "w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl",
                    "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                    "transition-all duration-300 hover:border-gray-400",
                    "bg-gray-50/50 focus:bg-white",
                    "placeholder:text-gray-500"
                  )}
                  whileFocus={{ scale: 1.02 }}
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.form>
            </div>

            {/* Navigation Links */}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/categories"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  Kategoriler
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  Ürünler
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Section - Cart & User Menu */}
          <motion.div 
            className="hidden md:flex items-center space-x-2 ml-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <motion.button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="h-5 w-5" />
                  <span>{user?.firstName}</span>
                </motion.button>
                <motion.div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >

                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Profil
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Siparişlerim
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Favorilerim
                  </Link>
                  {isAdmin && (
                    <>
                      <hr className="my-2 border-gray-200" />
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </>
                  )}
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login Dropdown */}
                <div className="relative group">
                  <motion.button 
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="h-4 w-4" />
                    <span>Giriş Yap</span>
                  </motion.button>
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      👤 Kullanıcı Girişi
                    </Link>
                    <Link
                      to="/admin/login"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      🔐 Admin Girişi
                    </Link>
                  </motion.div>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Kayıt Ol
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Cart - Moved after user menu */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/cart" className="relative p-3 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </motion.span>
                  )}
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search */}
        <motion.div 
          className="md:hidden pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSearch} className="relative group">
            <motion.input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün, marka ara..."
              className={cn(
                "w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                "transition-all duration-300 hover:border-gray-400",
                "bg-gray-50/50 focus:bg-white"
              )}
              whileFocus={{ scale: 1.02 }}
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="px-4 pt-2 pb-4 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/categories"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kategoriler
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/products"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ürünler
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/cart"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Sepet {cartItemCount > 0 && (
                    <motion.span
                      className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
              
              {isAuthenticated ? (
                <>

                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Siparişlerim
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/favorites"
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Favorilerim
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      Çıkış Yap
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 Kullanıcı Girişi
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/admin/login"
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🔐 Admin Girişi
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}; 
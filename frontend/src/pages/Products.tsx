import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Grid3X3, List, ChevronLeft, Heart } from 'lucide-react';
import api, { cartService, authService } from '../services/api';
import { Product, Category } from '../types';
import { useToastContext } from '../contexts/ToastContext';
import { favoriteService } from '../services/favoriteService';
import { getMainProductImage } from '../utils/imageUtils';

export const Products: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError, showWarning } = useToastContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showCategories, setShowCategories] = useState<boolean>(true);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Kategorileri sadece bir kez yükle
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesRes = await api.get('/categories');
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      setCategories([]);
    }
  }, []);

  // Ürünleri yükle
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      
      const searchQuery = searchParams.get('search');
      const categoryQuery = searchParams.get('category');
      let productsRes;
      
      if (searchQuery) {
        // Arama yapılıyorsa
        productsRes = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchTerm(searchQuery);
        setSelectedCategory('');
      } else if (categoryQuery) {
        // Query parametresi ile kategori seçiliyse - büyük pageSize ile tüm ürünleri getir
        productsRes = await api.get(`/products/category/${categoryQuery}?pageSize=1000`);
        setSelectedCategory(categoryQuery);
        setSearchTerm('');
      } else if (categoryId) {
        // URL path ile kategori seçiliyse - büyük pageSize ile tüm ürünleri getir
        productsRes = await api.get(`/products/category/${categoryId}?pageSize=1000`);
        setSelectedCategory(categoryId);
        setSearchTerm('');
      } else {
        // Tüm ürünler - büyük pageSize ile tüm ürünleri getir
        productsRes = await api.get('/products?pageSize=1000');
        setSelectedCategory('');
        setSearchTerm('');
      }
      
      const allProducts = productsRes.data.data || [];
      setTotalProducts(allProducts.length);
      setProducts(allProducts);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setProductsLoading(false);
    }
  }, [categoryId, searchParams]);

  // İlk yüklemede hem kategorileri hem ürünleri yükle
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
    };
    
    if (categories.length === 0) {
      loadInitialData();
    } else {
      fetchProducts();
    }
  }, [categoryId, categories.length, fetchCategories, fetchProducts]);

  // Favorileri yükle
  useEffect(() => {
    loadFavorites();
    
    // Favoriler güncellendiğinde yeniden yükle
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
  }, []);

  const loadFavorites = async () => {
    try {
      if (authService.isAuthenticated()) {
        const favorites = await favoriteService.getFavorites();
        const favoriteIds = favorites.map(f => f.productId);
        setLikedProducts(new Set(favoriteIds));
      }
    } catch (error) {
      // Hata durumunda sessizce geç, favoriler yüklenemezse sadece boş set kullan
      setLikedProducts(new Set());
    }
  };

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, searchParams]);

  const handleCategoryFilter = (catId: string) => {
    if (catId) {
      navigate(`/products?category=${catId}`);
    } else {
      navigate('/products');
    }
  };

  // Pagination functions
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    // Sayfalama her zaman gösterilsin
    // if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Önceki
        </button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              page === currentPage
                ? 'text-white bg-blue-600 border border-blue-600'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleLike = async (productId: number) => {
    try {
      if (!authService.isAuthenticated()) {
        showWarning('Giriş Gerekli', 'Favorilere eklemek için giriş yapmalısınız.');
        return;
      }

      const newLiked = new Set(likedProducts);
      if (newLiked.has(productId)) {
        await favoriteService.removeFromFavorites(productId);
        newLiked.delete(productId);
        showSuccess('Başarılı!', 'Ürün favorilerden kaldırıldı');
      } else {
        await favoriteService.addToFavorites(productId);
        newLiked.add(productId);
        showSuccess('Başarılı!', 'Ürün favorilere eklendi');
      }
      setLikedProducts(newLiked);
      
      // Diğer sayfalardaki favori durumunu güncelle
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error: any) {
      if (error.response?.status === 401) {
        showError('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
      } else {
        showError('Hata!', error.response?.data?.message || 'Favori işlemi sırasında bir hata oluştu');
      }
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!authService.isAuthenticated()) {
      showWarning('Giriş Gerekli', 'Sepete ürün eklemek için giriş yapmalısınız!');
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(productId);
      await cartService.addItem(productId, 1);
      
      showSuccess('Başarılı!', 'Ürün sepete eklendi!');
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error: any) {
      console.error('Sepete ekleme hatası:', error);
      
      if (error.response?.status === 401) {
        showError('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
        navigate('/login');
      } else {
        showError('Hata!', error.response?.data?.message || 'Sepete ekleme sırasında bir hata oluştu');
      }
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Kategoriler */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5" />
                  Kategoriler
                </h3>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="text-white hover:text-blue-200 transition-colors lg:hidden"
                >
                  {showCategories ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className={`${showCategories ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4">
                {/* Tüm Ürünler */}
                <button
                  onClick={() => handleCategoryFilter('')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 mb-3 ${
                    !selectedCategory 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="font-medium">Tüm Ürünler</span>
                </button>

                {/* Ana Kategoriler - Dynamic Height Container */}
                <div className="pr-2 space-y-2">
                  {categories.map((category, index) => (
                    <div key={category.id} className="relative">
                      {/* Ana Kategori */}
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleCategoryFilter(category.id.toString())}
                            className={`flex-1 text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 rounded-l-lg ${
                              selectedCategory === category.id.toString() 
                                ? 'bg-blue-50 text-blue-700 font-medium' 
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <span className="font-medium">{category.name}</span>
                          </button>
                          
                          {/* Expand/Collapse Button */}
                          {category.subCategories && category.subCategories.length > 0 && (
                            <button
                              onClick={() => toggleCategoryExpansion(category.id)}
                              className="px-3 py-3 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors rounded-r-lg border-l border-gray-200"
                            >
                              {expandedCategories.has(category.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                        
                        {/* Alt Kategoriler */}
                        {category.subCategories && 
                         category.subCategories.length > 0 && 
                         expandedCategories.has(category.id) && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            <div className="py-2">
                              {category.subCategories.map(subCategory => (
                                <button
                                  key={subCategory.id}
                                  onClick={() => handleCategoryFilter(subCategory.id.toString())}
                                  className={`w-full text-left px-6 py-2 transition-all duration-200 flex items-center gap-3 text-sm ${
                                    selectedCategory === subCategory.id.toString() 
                                      ? 'bg-blue-100 text-blue-700 font-medium' 
                                      : 'hover:bg-white text-gray-600'
                                  }`}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 ml-2"></div>
                                  <span>{subCategory.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ürünler */}
        <div className="lg:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchTerm 
                ? `"${searchTerm}" için arama sonuçları`
                : categoryId 
                  ? (() => {
                      // Ana kategorilerde ara
                      const mainCategory = categories.find(c => c.id === parseInt(categoryId));
                      if (mainCategory) return mainCategory.name;
                      
                      // Alt kategorilerde ara
                      for (const category of categories) {
                        if (category.subCategories) {
                          const subCategory = category.subCategories.find(sc => sc.id === parseInt(categoryId));
                          if (subCategory) return `${category.name} > ${subCategory.name}`;
                        }
                      }
                      return 'Kategori';
                    })()
                  : 'Tüm Ürünler'
              }
            </h1>
            <p className="text-gray-600 mt-2">
              {totalProducts} ürün bulundu
            </p>
            {searchTerm && (
              <div className="mt-2">
                <button
                  onClick={() => navigate('/products')}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Aramayı temizle
                </button>
              </div>
            )}
          </div>

          {productsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Arama sonucu bulunamadı' : 'Ürün bulunamadı'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `"${searchTerm}" için ürün bulunamadı. Farklı kelimeler deneyin.`
                  : 'Bu kategoride henüz ürün bulunmuyor.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => navigate('/products')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tüm Ürünleri Gör
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative aspect-w-1 aspect-h-1 w-full h-48 bg-gray-200">
                    <img
                      src={getMainProductImage(product.productImages)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Favori Butonu */}
                    <button
                      onClick={() => toggleLike(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${likedProducts.has(product.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              ₺{product.discountPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₺{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ₺{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart === product.id}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                    >
                      {addingToCart === product.id ? 'Ekleniyor...' : 'Sepete Ekle'}
                    </button>
                  </div>
                </div>
              ))}

                {currentProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Bu kategoride ürün bulunamadı.</p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 
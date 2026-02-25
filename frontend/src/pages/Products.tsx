import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Grid, List, ChevronLeft, Heart } from 'lucide-react';
import api, { cartService, authService } from '../services/api';
import { Product, Category } from '../types';
import { useToastContext } from '../contexts/ToastContext';
import { favoriteService } from '../services/favoriteService';
import { getMainProductImage } from '../utils/imageUtils';

export const Products: React.FC = () => {
  const { categoryId: pathCategoryId } = useParams();
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Kategorileri yükle
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
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
      const categoryQuery = searchParams.get('category') ?? pathCategoryId; // Query veya path param
      let productsRes;

      if (searchQuery) {
        productsRes = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchTerm(searchQuery);
        setSelectedCategory('');
      } else if (categoryQuery) {
        productsRes = await api.get(`/products/category/${categoryQuery}?pageSize=1000`);
        setSelectedCategory(categoryQuery || '');
        setSearchTerm('');
      } else {
        productsRes = await api.get('/products?pageSize=1000');
        setSelectedCategory('');
        setSearchTerm('');
      }

      const allProducts = productsRes.data.data || [];
      setProducts(allProducts);
      setTotalProducts(allProducts.length);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setProductsLoading(false);
    }
  }, [pathCategoryId, searchParams]);

  // İlk yükleme
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
    };

    if (categories.length === 0) load();
    else fetchProducts();
  }, [pathCategoryId, categories.length, fetchCategories, fetchProducts]);

  // Favorileri yükle
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (authService.isAuthenticated()) {
          const favorites = await favoriteService.getFavorites();
          setLikedProducts(new Set(favorites.map(f => f.productId)));
        }
      } catch {
        setLikedProducts(new Set());
      }
    };

    loadFavorites();
    const handler = () => loadFavorites();
    window.addEventListener('favoritesUpdated', handler);
    return () => window.removeEventListener('favoritesUpdated', handler);
  }, []);

  // Pagination reset
  useEffect(() => setCurrentPage(1), [pathCategoryId, searchParams]);

  // Sidebar kategori tıklaması
  const handleCategoryFilter = (catId: string) => {
    if (catId) navigate(`/products/${catId}`);
    else navigate('/products');
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const toggleCategoryExpansion = (catId: number) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(catId)) newSet.delete(catId);
    else newSet.add(catId);
    setExpandedCategories(newSet);
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
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error: any) {
      showError('Hata!', error.response?.data?.message || 'Favori işlemi sırasında bir hata oluştu');
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!authService.isAuthenticated()) {
      showWarning('Giriş Gerekli', 'Sepete ürün eklemek için giriş yapmalısınız!');
      navigate('/login'); return;
    }

    try {
      setAddingToCart(productId);
      await cartService.addItem(productId, 1);
      showSuccess('Başarılı!', 'Ürün sepete eklendi!');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error: any) {
      showError('Hata!', error.response?.data?.message || 'Sepete ekleme sırasında bir hata oluştu');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Sayfa yükleniyor...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Grid className="h-5 w-5" /> Kategoriler</h3>
              <button onClick={() => setShowCategories(!showCategories)} className="text-white lg:hidden">
                {showCategories ? <ChevronDown className="h-5 w-5"/> : <ChevronRight className="h-5 w-5"/>}
              </button>
            </div>

            <div className={`${showCategories ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4">
                <button onClick={() => handleCategoryFilter('')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 mb-3 ${!selectedCategory ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <List className="h-4 w-4"/> <span>Tüm Ürünler</span>
                </button>

                <div className="pr-2 space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="relative">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex items-center">
                        <button onClick={() => handleCategoryFilter(cat.id.toString())} className={`flex-1 text-left px-4 py-3 ${selectedCategory === cat.id.toString() ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <span>{cat.name}</span>
                        </button>
                        {cat.subCategories?.length > 0 && (
                          <button onClick={() => toggleCategoryExpansion(cat.id)} className="px-3 py-3 border-l border-gray-200 text-gray-400 hover:text-gray-600">
                            {expandedCategories.has(cat.id) ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                          </button>
                        )}
                      </div>

                      {cat.subCategories?.length > 0 && expandedCategories.has(cat.id) && (
                        <div className="border-t border-gray-200 bg-gray-50 py-2">
                          {cat.subCategories.map(sub => (
                            <button key={sub.id} onClick={() => handleCategoryFilter(sub.id.toString())} className={`w-full text-left px-6 py-2 text-sm ${selectedCategory === sub.id.toString() ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-white text-gray-600'}`}>
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
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
                : selectedCategory
                  ? (() => {
                      const catId = parseInt(selectedCategory);
                      const mainCat = categories.find(c => c.id === catId);
                      if (mainCat) return mainCat.name;
                      for (const c of categories) {
                        const sub = c.subCategories?.find(sc => sc.id === catId);
                        if (sub) return `${c.name} > ${sub.name}`;
                      }
                      return 'Kategori';
                    })()
                  : 'Tüm Ürünler'}
            </h1>
            <p className="text-gray-600 mt-2">{totalProducts} ürün bulundu</p>
          </div>

          {productsLoading ? (
            <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-600">Ürünler yükleniyor...</p></div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">Bu kategoride ürün bulunamadı.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map(p => (
                <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative aspect-w-1 aspect-h-1 w-full h-48 bg-gray-200">
                    <img src={getMainProductImage(p.images)} alt={p.name} className="w-full h-full object-cover"/>
                    <button onClick={() => toggleLike(p.id)} className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors">
                      <Heart className={`w-4 h-4 ${likedProducts.has(p.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{p.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {p.discountPrice ? (
                          <>
                            <span className="text-lg font-bold text-red-600">₺{p.discountPrice.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 line-through">₺{p.price.toLocaleString()}</span>
                          </>
                        ) : <span className="text-lg font-bold text-gray-900">₺{p.price.toLocaleString()}</span>}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">{p.rating} ({p.reviewCount})</span>
                      </div>
                    </div>
                    <button onClick={() => handleAddToCart(p.id)} disabled={addingToCart === p.id} className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200">
                      {addingToCart === p.id ? 'Ekleniyor...' : 'Sepete Ekle'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

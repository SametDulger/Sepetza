import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../../../contexts/ToastContext';
import api from '../../../services/api';

interface Category {
  id: number;
  name: string;
  description: string;
  parentCategoryName?: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  createdDate?: string; // Backend compatibility
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { showError, showSuccess } = useToastContext();

  const fetchCategories = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/categories?page=${page}&pageSize=10&search=${encodeURIComponent(search)}`);
      
      // Handle different response structures
      let categoriesData = [];
      let totalPagesData = 0;
      
      if (response.data) {
        if (response.data.success && response.data.data) {
          if (response.data.data.items) {
            categoriesData = response.data.data.items;
            totalPagesData = response.data.data.totalPages || 0;
          } else if (response.data.data.data) {
            categoriesData = response.data.data.data;
            totalPagesData = response.data.data.totalPages || response.data.data.TotalPages || 0;
          } else if (response.data.data.Data) {
            categoriesData = response.data.data.Data;
            totalPagesData = response.data.data.TotalPages || response.data.data.totalPages || 0;
          } else if (Array.isArray(response.data.data)) {
            categoriesData = response.data.data;
            totalPagesData = 1;
          } else {
            if (response.data.data.id || response.data.data.name) {
              categoriesData = [response.data.data];
              totalPagesData = 1;
            }
          }
        } else if (response.data.items) {
          categoriesData = response.data.items;
          totalPagesData = response.data.totalPages || 0;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
          totalPagesData = 1;
        } else {
          // Try to find any array in the response
          const findArrayInObject = (obj: any): any[] => {
            if (Array.isArray(obj)) return obj;
            for (const key in obj) {
              if (Array.isArray(obj[key])) return obj[key];
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                const result = findArrayInObject(obj[key]);
                if (result.length > 0) return result;
              }
            }
            return [];
          };
          
          categoriesData = findArrayInObject(response.data);
          totalPagesData = 1;
        }
      }
      
      // Map backend fields to frontend fields
      const mappedCategories = categoriesData.map((category: any) => ({
        ...category,
        createdAt: category.createdAt || category.createdDate || new Date().toISOString()
      }));
      
      setCategories(mappedCategories);
      setTotalPages(totalPagesData);
    } catch (error: any) {
      showError(error.response?.data?.message || error.message || 'Kategoriler yüklenirken hata oluştu');
      setCategories([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories(1, searchTerm);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/categories/${id}`);
      if (response.data.success) {
        showSuccess('Kategori başarıyla silindi');
        fetchCategories(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Kategori silinirken hata oluştu');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Kategori silinirken hata oluştu');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await api.patch(`/admin/categories/${id}/toggle-status`);
      if (response.data.success) {
        showSuccess('Kategori durumu güncellendi');
        fetchCategories(currentPage, searchTerm);
      } else {
        showError(response.data.message || 'Kategori durumu güncellenirken hata oluştu');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Kategori durumu güncellenirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
        <button
          onClick={() => navigate('/admin/categories/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Yeni Kategori
        </button>
      </div>

      {/* Arama */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Ara
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setCurrentPage(1);
              fetchCategories(1, '');
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Temizle
          </button>
        </form>
      </div>

      {/* Kategori Tablosu */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Üst Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Sayısı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {category.description.length > 50 
                      ? `${category.description.substring(0, 50)}...` 
                      : category.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {category.parentCategoryName || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{category.productCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(category.id)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {category.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Arama kriterlerine uygun kategori bulunamadı.' : 'Henüz kategori eklenmemiş.'}
          </div>
        )}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Önceki
            </button>
            <span className="px-3 py-2 bg-blue-600 text-white rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories; 
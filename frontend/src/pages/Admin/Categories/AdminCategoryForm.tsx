import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToastContext } from '../../../contexts/ToastContext';
import api from '../../../services/api';

interface Category {
  id: number;
  name: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentCategoryId: number | null;
  isActive: boolean;
}

const AdminCategoryForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToastContext();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentCategoryId: null,
    isActive: true
  });
  
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchParentCategories();
      if (isEdit && id) {
        await fetchCategory(parseInt(id));
      }
    };
    fetchData();
  }, [id, isEdit]);

  const fetchParentCategories = async () => {
    try {
      // Hierarchy endpoint'ini kullanarak tüm kategorileri al
      const response = await api.get('/admin/categories/hierarchy');
      
      
      // Handle different response structures
      let categoriesData = [];
      if (response.data.success && response.data.data) {
        categoriesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data;
      }
      
      // Flatten hierarchy to simple list for dropdown - only main categories for parent selection
      const flattenCategories = (categories: any[]): any[] => {
        let flattened: any[] = [];
        categories.forEach(category => {
          flattened.push({
            id: category.id,
            name: category.name
          });
          // Alt kategorileri de ekle ama sadece 1 seviye
          if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach((subCategory: any) => {
              flattened.push({
                id: subCategory.id,
                name: `-- ${subCategory.name}`
              });
            });
          }
        });
        return flattened;
      };

      const flatCategories = flattenCategories(categoriesData);
      setParentCategories(flatCategories);
      
    } catch (error: any) {
      console.error('Error fetching parent categories:', error);
      // Fallback to regular categories endpoint
      try {
        const fallbackResponse = await api.get('/admin/categories');

        
        let categoriesData = [];
        if (fallbackResponse.data.success && fallbackResponse.data.data) {
          if (fallbackResponse.data.data.items) {
            categoriesData = fallbackResponse.data.data.items;
          } else if (Array.isArray(fallbackResponse.data.data)) {
            categoriesData = fallbackResponse.data.data;
          }
        } else if (fallbackResponse.data.items) {
          categoriesData = fallbackResponse.data.items;
        } else if (Array.isArray(fallbackResponse.data)) {
          categoriesData = fallbackResponse.data;
        }
        setParentCategories(categoriesData);
      } catch (fallbackError: any) {
        console.error('Error fetching parent categories fallback:', fallbackError);
        showError(fallbackError.response?.data?.message || 'Kategoriler yüklenirken hata oluştu');
      }
    }
  };

  const fetchCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/categories/${categoryId}`);
      // Handle different response structures
      let categoryData = null;
      if (response.data.success && response.data.data) {
        categoryData = response.data.data;
      } else if (response.data.id) {
        categoryData = response.data;
      }

      if (categoryData) {
        setFormData({
          name: categoryData.name || '',
          description: categoryData.description || '',
          parentCategoryId: categoryData.parentCategoryId || null,
          isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
        });
      } else {
        throw new Error('Kategori verisi bulunamadı');
      }
    } catch (error: any) {
      console.error('Error fetching category:', error);
      showError(error.response?.data?.message || 'Kategori yüklenirken hata oluştu');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      showError('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        ...formData,
        parentCategoryId: formData.parentCategoryId === 0 ? null : formData.parentCategoryId
      };

      let response;
      if (isEdit) {
        response = await api.put(`/admin/categories/${id}`, submitData);
      } else {
        response = await api.post('/admin/categories', submitData);
      }

      if (response.data.success) {
        showSuccess(isEdit ? 'Kategori başarıyla güncellendi' : 'Kategori başarıyla oluşturuldu');
        navigate('/admin/categories');
      } else {
        showError(response.data.message || 'İşlem sırasında hata oluştu');
      }
    } catch (error: any) {
      console.error('Error submitting category:', error);
      showError(error.response?.data?.message || 'İşlem sırasında hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : name === 'parentCategoryId' ? (value === '' ? null : parseInt(value))
              : value
    }));
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
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/categories')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          ← Geri
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Adı *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Üst Kategori
            </label>
            <select
              name="parentCategoryId"
              value={formData.parentCategoryId || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Ana Kategori</option>
              {parentCategories
                .filter(cat => !isEdit || cat.id !== parseInt(id || '0'))
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Aktif
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryForm; 
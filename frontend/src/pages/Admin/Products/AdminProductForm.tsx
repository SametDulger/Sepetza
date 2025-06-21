import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useToast } from '../../../hooks/useToast';
import { getImageUrl } from '../../../utils/imageUtils';

interface Category {
  id: number;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string;
  isActive: boolean;
}

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    imageUrl: '',
    isActive: true
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchProduct(parseInt(id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategories = async () => {
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
      
      // Flatten hierarchy to simple list for dropdown
      const flattenCategories = (categories: any[]): any[] => {
        let flattened: any[] = [];
        categories.forEach(category => {
          flattened.push({
            id: category.id,
            name: category.name,
            level: 0
          });
          if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach((subCategory: any) => {
              flattened.push({
                id: subCategory.id,
                name: `-- ${subCategory.name}`,
                level: 1
              });
            });
          }
        });
        return flattened;
      };

      const flatCategories = flattenCategories(categoriesData);
      setCategories(flatCategories);
      
    } catch (error: any) {
      console.error('Error fetching categories:', error);
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
        setCategories(categoriesData);
      } catch (fallbackError: any) {
        console.error('Error fetching categories fallback:', fallbackError);
        showError(fallbackError.response?.data?.message || 'Kategoriler yüklenirken hata oluştu');
      }
    }
  };

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/products/${productId}`);
      // Handle different response structures
      let productData = null;
      if (response.data.success && response.data.data) {
        productData = response.data.data;
      } else if (response.data.id) {
        productData = response.data;
      }

      if (productData) {
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          stock: productData.stock || 0,
          categoryId: productData.categoryId || 0,
          imageUrl: productData.imageUrl || '',
          isActive: productData.isActive !== undefined ? productData.isActive : true
        });
        
        // Mevcut resim varsa preview'da göster
        if (productData.imageUrl) {
          setPreviewUrl('');
        }
      } else {
        throw new Error('Ürün verisi bulunamadı');
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      showError(error.response?.data?.message || 'Ürün yüklenirken hata oluştu');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0 || formData.categoryId === 0) {
      showError('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    if (formData.stock < 0) {
      showError('Stok miktarı negatif olamaz');
      return;
    }

    try {
      setSubmitting(true);
      
      // Önce resim varsa yükle
      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        imageUrl = await uploadImage();
      }

      // Eğer resim yoksa ve yeni ürün ekliyorsa, varsayılan resmi kullan
      if (!imageUrl && !isEdit) {
        imageUrl = 'product-image-placeholder.jpg';
      }

      const productData = {
        ...formData,
        imageUrl
      };

      let response;
      if (isEdit && id) {
        response = await api.put(`/admin/products/${id}`, productData);
      } else {
        response = await api.post('/admin/products', productData);
      }

      if (response.data.success) {
        showSuccess(isEdit ? 'Ürün başarıyla güncellendi' : 'Ürün başarıyla oluşturuldu');
        navigate('/admin/products');
      } else {
        showError(response.data.message || 'İşlem sırasında hata oluştu');
      }
    } catch (error: any) {
      console.error('Error submitting product:', error);
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
              : type === 'number' ? parseFloat(value) || 0 
              : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        showError('Lütfen sadece resim dosyası seçin');
        return;
      }

      setSelectedFile(file);
      
      // Preview oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) return '';

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.post('/admin/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message || 'Resim yüklenirken hata oluştu');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.response?.data?.message || 'Resim yüklenirken hata oluştu');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
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
          onClick={() => navigate('/admin/products')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          ← Geri
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Adı *
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
                Kategori *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Miktarı *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Resmi
            </label>
            <div className="space-y-4">
              {/* Mevcut resim preview */}
              {(previewUrl || formData.imageUrl) && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl || getImageUrl(formData.imageUrl)}
                    alt="Ürün resmi"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getImageUrl('product-image-placeholder.jpg');
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* File input */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF dosyaları desteklenir. Maksimum 5MB.
                </p>
              </div>

              {/* URL input alternatif */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Veya URL ile ekle
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
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
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'Resim Yükleniyor...' : submitting ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm; 
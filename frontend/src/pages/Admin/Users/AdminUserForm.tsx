import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToastContext } from '../../../contexts/ToastContext';
import api from '../../../services/api';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AdminUserForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToastContext();

  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'User',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUser(parseInt(id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUser = async (userId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users/${userId}`);
      const user = response.data;
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
    } catch (error) {
      showError('Kullanıcı yüklenirken hata oluştu');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showError('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/admin/users/${id}`, formData);
      showSuccess('Kullanıcı başarıyla güncellendi');
      navigate('/admin/users');
    } catch (error: any) {
      showError(error.response?.data?.message || 'İşlem sırasında hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
          onClick={() => navigate('/admin/users')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          ← Geri
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Düzenle</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soyad *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="User">Kullanıcı</option>
              <option value="Admin">Admin</option>
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
              onClick={() => navigate('/admin/users')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Kaydediliyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm; 